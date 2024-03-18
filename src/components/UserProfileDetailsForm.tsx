import {zodResolver} from "@hookform/resolvers/zod"
import {FieldValues, useForm} from "react-hook-form"
import z from "zod"
import {ChangeEvent, useRef, useState} from "react";
import avatar from "../assets/avatar.jpeg";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faImage} from "@fortawesome/free-solid-svg-icons";
import {updatePhoto, uploadPhoto} from "../services/file-service.ts";
import {saveNewUserProfileDetails, updateUserProfileDetails} from "../services/user-profile-details-service.ts";
import {alertState, UserDetailsData, userDetailsState} from "../stateManagement/RecoilState.ts";
import {useRecoilState} from "recoil";
import {useNavigate} from "react-router-dom";
import {clearAllFromLocalStorage} from "../services/token-service.ts";


const schema = z.object({
    name: z.string().min(3, "Name must be longer then 3 charecters").max(20, "Name must be less then 20 charecters"),
    contactEmail: z.string().optional(),
    contactPhoneNumber: z.number().optional(),//todo: add validation of length
    age: z.number().min(18, "Age must be more then 17").optional()
})

type FormData = z.infer<typeof schema>

export interface UserProfileDetailsProps {
    isInRegistrationMode: boolean
}


function UserProfileDetailsForm(props: UserProfileDetailsProps) {
    const [userProfileDetails, setUserProfileDetails] = useRecoilState(userDetailsState);
    const [alertPopup, setAlertPopup] = useRecoilState(alertState);

    const [imgSrc, setImgSrc] = useState<File>()
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [nameInputState, setNameInputState] = useState<string | undefined>(!props.isInRegistrationMode ? userProfileDetails.name : undefined);
    const [contactEmailInputState, setContactEmailInputState] = useState<string | undefined>(!props.isInRegistrationMode ? userProfileDetails.contactEmail : undefined);
    const [contactPoneNumInputState, setContactPoneNumInputState] = useState<number | undefined>(!props.isInRegistrationMode ? userProfileDetails.contactPhoneNumber : undefined);
    const [ageInputState, setAgeInputState] = useState<number | undefined>(!props.isInRegistrationMode ? userProfileDetails.age : undefined);
    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();


    const imgSelected = (e: ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value)
        if (e.target.files && e.target.files.length > 0) {
            setImgSrc(e.target.files[0])
        }
    }
    const selectImg = () => {
        console.log("Selecting profile image...")
        fileInputRef.current?.click()
    }


    const {register, handleSubmit, formState: {errors}} = useForm<FormData>({resolver: zodResolver(schema)})

    const onSubmit = async (data: FieldValues) => {

        let userProfileDetailsToForSaving: UserDetailsData = {
            name: nameInputState,
            contactEmail: contactEmailInputState,
            contactPhoneNumber: contactPoneNumInputState,
            age: ageInputState,
        } as UserDetailsData;

        let url: string | undefined = undefined;
        //updateing the photo
        if (imgSrc && userProfileDetails.profileImage) {
            userProfileDetailsToForSaving = {...userProfileDetailsToForSaving, user: userProfileDetails.user} as UserDetailsData;
            try {
                url = await updatePhoto(userProfileDetails.profileImage, imgSrc);
                console.log("Image updated successfully. New URL:", url);
            } catch (error) {
                if (error instanceof Error && error.message === "404") {
                    try {
                       url = await uploadPhoto(imgSrc!)
                    } catch (e){
                        console.error("Error updating the image:", error);
                        setAlertPopup({message: "Error updating the image!", variant:"danger"});
                    }
                } else {
                    console.error("Error updating the image:", error);
                    setAlertPopup({message: "Error updating the image!", variant:"danger"});
                }

            }
        } else {
            url = imgSrc ? await uploadPhoto(imgSrc!) : undefined;
            console.log("uploaded image url:" + url);
        }

        userProfileDetailsToForSaving = {...userProfileDetailsToForSaving, profileImage: url} as UserDetailsData;


        !props.isInRegistrationMode && updateUserProfileDetails({...userProfileDetailsToForSaving, user: userProfileDetails.user}).then(value => {
            setUserProfileDetails(value);
            setAlertPopup({message: "User Profile Data was updated successfully", variant:"success"})
            navigate("/my-profile")
        }).catch((error) => {
            console.log(error);
            setAlertPopup({message: "Error during updating user profile data...", variant:"danger"});
        })


        props.isInRegistrationMode && saveNewUserProfileDetails(userProfileDetailsToForSaving)
            .then(value => {
                console.log(value);
                setUserProfileDetails(value);
                setAlertPopup({message: "User Profile Data was saved successfully", variant:"success"})
                navigate("/");
            }).catch(reason => {
                console.log("on error: ", reason);
                setAlertPopup({message: "Error during saving user profile data...", variant:"danger"});
                clearAllFromLocalStorage();
                navigate("..")
            })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="vstack gap-3 col-md-7 mx-auto"
              style={{overflowY:"auto", marginTop:"2rem", height:"84vh", backgroundColor:"seashell"}}>
                <div style={{position:"fixed", zIndex:"1", top: "50%", left: "50%", transform: 'translate(-50%, -50%)'}}>
                    {loading && (
                        <div className="spinner-border" role="status">
                            <span className="sr-only"></span>
                        </div>
                    )}
                </div>
            <h1>My Profile</h1>
            <div className="d-flex justify-content-center position-relative">
                <img
                    src={imgSrc ? URL.createObjectURL(imgSrc) : (userProfileDetails.profileImage ? userProfileDetails.profileImage : avatar)}
                    alt={avatar} style={{height: "230px", width: "230px"}}
                    className="img-fluid"/>
                <button type="button" className="btn position-absolute bottom-0 end-0" onClick={selectImg}>
                    <FontAwesomeIcon icon={faImage} className="fa-xl"/>
                </button>
            </div>
            <input style={{display: "none"}} ref={fileInputRef} type="file" onChange={imgSelected}></input>
            <div className="mb-3 mt-3">
                <label htmlFor="name">Name</label>
                <input {...register("name")} type="text" id="name" className="form-control" value={nameInputState}
                       onChange={(event) => setNameInputState(event.target.value)}/>
                {errors.name && <p className="text-danger">{errors.name.message}</p>}
            </div>
            <div className="mb-3">
                <label htmlFor="email">Contact Email (Optional)</label>
                <input {...register("contactEmail")} type="email" id="email"
                       value={contactEmailInputState}
                       onChange={(event) => setContactEmailInputState(event.target.value)}
                       className="form-control"/>
                {errors.contactEmail && <p className="text-danger">{errors.contactEmail.message}</p>}
            </div>
            <div className="mb-3">
                <label htmlFor="phoneNumber">Contact Phone Number (Optional)</label>
                <input {...register("contactPhoneNumber", {setValueAs: (v) => (v === "" ? undefined : parseInt(v))})}
                       value={contactPoneNumInputState}
                       onChange={(event) => setContactPoneNumInputState(event.target.value === "" ? undefined : parseInt(event.target.value))}
                       type="tel" id="phoneNumber"
                       className="form-control"/>
                {errors.contactPhoneNumber && <p className="text-danger">{errors.contactPhoneNumber.message}</p>}
            </div>
            <div className="mb-3">
                <label htmlFor="age">Age (Optional)</label>
                <input {...register("age", {setValueAs: (v) => (v === "" ? undefined : parseInt(v))})}
                       value={ageInputState}
                       onChange={(event) => setAgeInputState(event.target.value === "" ? undefined : parseInt(event.target.value))}
                       type="number"
                       id="age" className="form-control"/>
                {errors.age && <p className="text-danger">{errors.age.message}</p>}
            </div>
            <button type="submit" className="btn btn-primary mb-2">Submit</button>
        </form>
    )
}

export default UserProfileDetailsForm
