import {zodResolver} from "@hookform/resolvers/zod"
import {FieldValues, useForm} from "react-hook-form"
import z from "zod"
// import {getIdToken} from "./services/token-service.ts";
// import axios from "axios";
// import {googleSignin, registerUser} from "./services/user-service.ts";
// import {GoogleRegistration} from "./interfaces/google-registration.ts";
// import {StandardRegistration} from "./interfaces/standard-registration.ts";

const schema = z.object({
    name: z.string().min(3, "Name must be longer then 3 charecters").max(20, "Name must be less then 20 charecters"),
    contactEmail: z.string().optional(),
    contactPhoneNumber: z.number().optional(),
    age: z.number().min(18, "Age must be more then 18").optional()
})

type FormData = z.infer<typeof schema>

export interface userProps {
    username: string;
    password: string;
}

console.log()

function UserProfileDetailsForm(props: userProps) {
    // const idToken: string | null = getIdToken();

    // const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
    // const [refreshToken, setRefreshToken] = useRecoilState(refreshTokenState);
    // const [idToken, setIdToken] = useRecoilState(idTokenState);


    const {register, handleSubmit, formState: {errors}} = useForm<FormData>({resolver: zodResolver(schema)})

    const onSubmit = async (data: FieldValues) => {
        // console.log("access token: ", accessToken);
        // console.log("refresh token: ", refreshToken);
        // console.log("id token: ", idToken);
        // setAccessToken(accessToken);
        // setRefreshToken(refreshToken);
        // setIdToken(idToken);


        console.log(props);
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
            <div className="mb-3 mt-3">
                <label htmlFor="name">Name</label>
                <input {...register("name")} type="text" id="name" className="form-control"/>
                {errors.name && <p className="text-danger">{errors.name.message}</p>}
            </div>
            <div className="mb-3">
                <label htmlFor="email">Contact Email (Optional)</label>
                <input {...register("contactEmail")} type="email" id="email" className="form-control"/>
                {errors.contactEmail && <p className="text-danger">{errors.contactEmail.message}</p>}
            </div>
            <div className="mb-3">
                <label htmlFor="phoneNumber">Contact Phone Number (Optional)</label>
                <input {...register("contactPhoneNumber", {setValueAs: (v) => (v === "" ? undefined : parseInt(v))})}
                       type="tel" id="phoneNumber"
                       className="form-control"/>
                {errors.contactPhoneNumber && <p className="text-danger">{errors.contactPhoneNumber.message}</p>}
            </div>
            <div className="mb-3">
                <label htmlFor="age">Age (Optional)</label>
                <input {...register("age", {setValueAs: (v) => (v === "" ? undefined : parseInt(v))})} type="number" id="age" className="form-control"/>
                {errors.age && <p className="text-danger">{errors.age.message}</p>}
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    )
}

export default UserProfileDetailsForm
