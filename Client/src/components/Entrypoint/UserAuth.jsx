// import React from 'react'
// // import 'UserAuth.css' 
// import {useForm} from 'react-hook-form'



// const UserAuth = () => {

//   const {register, handleSubmit, formState:{errors},watch} = useForm()
  
//   const password = watch('password')

//   const onSubmit = (data)=>{
//     console.log(data)
//   }

//   return (
//     <div>
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <label htmlFor="username">username</label>
//         <input type="text" id='username' placeholder='enter username' 
//           {...register('username', {
//             required: 'username is mandatory',
//             minLength:{
//               value : 5,
//               message: 'username must be more than 4 characters'
//             },
//             maxLength:{
//               value:20,
//               message:'username cannot exeed 20 characters'
//             }
//           })}
//         />
//         {errors.username && <p>{errors.username.message}</p>}

//         <label htmlFor="email">username</label>
//         <input type="text" id='email' placeholder='enter email' 
//           {...register('email', {
//             required: 'email is mandatory',
//             pattern:{
//               value : /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
//               message: 'invalid email pattern'
//             }
//           })}
//         />
//         {errors.email && <p>{errors.email.message}</p>}


//         <label htmlFor="password">username</label>
//         <input type="text" id='password' placeholder='enter password' 
//           {...register('password', {
//             required: 'password is mandatory',
//             minLength:4
//           })}
//         />
//         {errors.password && <p>{errors.password.message}</p>}

//         <label htmlFor="confirm_password">username</label>
//         <input type="text" id='confirm_password' placeholder='enter password again' 
//           {...register('confirm_password', {
//             required: 'confirm your password',
//             validate: (value)=>
//               value === password || 'passwords donot match'
//           })}
//         />
//         {errors.confirm_password && <p>{errors.confirm_password.message}</p>}


//         <button type='submit'> Submit </button>
        
//       </form>
//     </div> 
//   )
// }

// export default UserAuth
