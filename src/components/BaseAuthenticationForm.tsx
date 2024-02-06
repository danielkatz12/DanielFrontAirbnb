import {GoogleLogin} from "@react-oauth/google";
import z from "zod";
import {FieldValues, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

const schema = z.object({
    email: z.string().optional(),
    password: z.string().min(6, "Password must be longer then 6 charecters").max(20, "Password must be less then 20 charecters").optional()
})
type FormData = z.infer<typeof schema>
// interface BaseAuthProps{
//     onSubmitButtonClick: () => void,
//     onCancelButtonClick: () => void,
// }
function BaseAuthenticationForm() {
    const {register, handleSubmit, formState: {errors}} = useForm<FormData>({resolver: zodResolver(schema)})

    const onSubmit = async (data: FieldValues) => {
        console.log("in Base Auth Submit")
        // console.log(props)
        console.log("data: ", data)

        // const userRegistrationDetails: GoogleRegistration = {
        //     name: data.name,
        //     email: data.email,
        //     phoneNumber: data.phoneNumber,
        //     age: data.age,
        // }
        // console.log(userRegistrationDetails);
        // if (idToken) {
        //     const googleRegistration: GoogleRegistration = {...userRegistrationDetails, idToken};
        //     await googleSignin(googleRegistration);
        // } else {
        //     const standardRegistration: StandardRegistration = {...userRegistrationDetails, ...props}
        //     await registerUser(standardRegistration)
        // }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="vstack gap-3 col-md-7 mx-auto">
                <h1>Register</h1>

                <div className="form-floating">
                    {/*<input ref={emailInputRef} type="text" className="form-control" id="floatingInput" placeholder=""/>*/}
                    <input {...register("email")} type="email" id="email" className="form-control"/>
                    {errors.email && <p className="text-danger">{errors.email.message}</p>}
                    <label htmlFor="floatingInput">Email</label>
                </div>
                <div className="form-floating">
                    {/*<input ref={passwordInputRef} type="password" className="form-control" id="floatingPassword"*/}
                    {/*       placeholder=""/>*/}
                    <input {...register("password")} type="password" id="email" className="form-control"/>
                    {errors.password && <p className="text-danger">{errors.password.message}</p>}
                    <label htmlFor="floatingPassword">Password</label>
                </div>
                {/*<button type="button" className="btn btn-primary" onClick={register}>My Name</button>*/}
                <button type="submit" className="btn btn-primary">Submit</button>

                <GoogleLogin onSuccess={onSubmit} onError={() => {
                }}/>
            </div>
        </form>
    );
}

export default BaseAuthenticationForm;
