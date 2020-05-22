const express = require('express');
const router = express.Router();
const { User } = require('../models/User');

const { auth } = require('../middleware/auth');

//=================================
//             User
//=================================

router.get('/auth', auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    role: req.user.role,
    image: req.user.image,
  });
});

router.post('/register', (req, res) => {
  const user = new User(req.body);

  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
      userData: doc,
    });
  });
});

router.post('/login', (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user)
      return res.json({
        loginSuccess: false,
        message: 'Auth failed, email not found',
      });

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ loginSuccess: false, message: 'Wrong password' });

      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        res.cookie('w_authExp', user.tokenExp);
        res.cookie('w_auth', user.token).status(200).json({
          loginSuccess: true,
          userId: user._id,
        });
      });
    });
  });
});

router.get('/logout', auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    { token: '', tokenExp: '' },
    (err, doc) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true,
      });
    }
  );
});

// Forgot password route
router.put('/forgot-password', async (req, res) => {
  const { email } = req.body;

  await User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        message: 'User with that email does not exist',
      });
    }

    const token = jwt.sign({ _id: user._id }, config.JWT_RESET_PASSWORD, {
      expiresIn: '30m',
    });

    const emailData = {
      from: config.EMAIL_FROM,
      to: email,
      subject: 'Gallery-X Password Reset link',
      html: `
                    <p>Dear ${user.name},</p>
                    <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
                    <p>Please click on the following link, or paste this into your browser to complete the process within 30 minutes of receiving it:</p>
                    <p>${config.CLIENT_URL}/users/password/reset/${token}</p>
                    <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
                    <p>Thank you for using Gallery-X.</p>
                    <p>Sincerely,<br>The Gallery-X Team</p>
                `,
    };

    return user.updateOne({ resetPasswordLink: token }, (err, success) => {
      if (err) {
        console.log('RESET PASSWORD LINK ERROR', err);
        return res.status(400).json({
          message: 'Database connection error on user password forgot request',
        });
      } else {
        sgMail
          .send(emailData)
          .then((sent) => {
            // console.log('SIGNUP EMAIL SENT', sent);
            return res.json({
              success: true,
              message: `An email has been sent to ${email}. Follow the instruction to reset your password for your account`,
            });
          })
          .catch((err) => {
            // console.log('SIGNUP EMAIL SENT ERROR', err);
            return res.json({
              message: err.message,
            });
          });
      }
    });
  });
});

// Reset password route
router.put('/reset-password', (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;
  if (resetPasswordLink) {
    jwt.verify(resetPasswordLink, config.JWT_RESET_PASSWORD, function (
      err,
      decoded
    ) {
      if (err) {
        return res.status(400).json({
          success: false,
          message: 'Incorrect token or expired link. Try again',
        });
      }

      User.findOne({ resetPasswordLink }, (err, user) => {
        if (err || !user) {
          return res.status(400).json({
            success: false,
            message: 'User with this token does not exist. Try again',
          });
        }

        const updatedFields = {
          password: newPassword,
          resetPasswordLink: '',
        };

        user = _.extend(user, updatedFields);

        user.save((err, result) => {
          if (err) {
            return res.status(400).json({
              success: false,
              message: 'Error resetting user password',
            });
          }
          res.json({
            success: true,
            message: 'Your password has been reset! You can login now.',
          });
        });
      });
    });
  }
});

module.exports = router;
