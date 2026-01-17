// Test file to verify modular structure works

// Test imports
console.log('Testing modular structure...');

try {
  // Test database imports
  const { migrateDatabase } = await import('./src/db/database.js');
  console.log('✅ Database module loaded');
  
  // Test auth imports
  const { authenticate, hashPassword } = await import('./src/auth/auth.js');
  console.log('✅ Auth module loaded');
  
  // Test routes imports
  const { handleRoute } = await import('./src/routes/index.js');
  console.log('✅ Routes module loaded');
  
  // Test main entry point
  const worker = await import('./src/index.js');
  console.log('✅ Main entry point loaded');
  
  console.log('🎉 All modules loaded successfully!');
  console.log('📊 Modular structure is ready for deployment');
  
} catch (error) {
  console.error('❌ Module loading failed:', error.message);
  process.exit(1);
}
