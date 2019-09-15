require('./app/app')
  .listen(process.env.PORT || 3000, () => {
    console.log('Server is running on 3000');
  });