const cekRole = (roles) => (req, res, next) => {
    try {
      // Memeriksa apakah pengguna ada di sesi
      if (!req.session || !req.session.role) {
        return res.status(401).json({ msg: 'Authorization denied. Please login first.' });
      }
  
      // Memeriksa apakah peran pengguna termasuk dalam peran yang diizinkan
      if (!roles.includes(req.session.role)) {
        return res.status(403).json({ msg: 'Access denied. You are not authorized to access this resource.' });
      }
      next();
    } catch (err) {
      console.error('Role check failed:', err);
      res.status(500).json({ msg: 'Server error' });
    }
  };
  
  module.exports = cekRole;
  