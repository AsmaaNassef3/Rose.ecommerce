/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,scss}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    borderRadius: {
      'custom': '10rem'
    },
    boxShadow: {
      'custom': '0 5px 20px #0000001A',
      'input':'box-shadow: 0px 10px 20px 0px #4461F20D',
    },
    extend: {
      borderWidth: {
        '0.99': '0.99px',
      }
      ,
      colors:
      {
        'heading':'#122D9C',
        'photo':'#F0F4FC',

      },
      borderRadius: {
        'custom2': '15px',
        'custom3':'20px'
      }
    },
  },
  plugins: [  require("daisyui"), require('flowbite/plugin')

   ],
}

