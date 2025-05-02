// server/middleware/validation.js
exports.validateDoctorCreation = [
    check('licenseNumber')
      .matches(/^[A-Z]{3}-\d{6}$/)
      .withMessage('Invalid license format'),
    check('consultationFee')
      .isFloat({ min: 50 })
      .withMessage('Minimum fee is $50'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    }
  ];