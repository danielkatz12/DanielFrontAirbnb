import {zodResolver} from "@hookform/resolvers/zod"
import {FieldValues, useForm} from "react-hook-form"
import z from "zod"
import {ChangeEvent, useEffect, useRef, useState} from "react";
import appartment from "../assets/appartment.png";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faImage} from "@fortawesome/free-solid-svg-icons";
import {updatePhoto, uploadPhoto} from "../services/file-service.ts";
import {currentDisplayedComponentState, fullPostsState, UserDetailsData} from "../stateManagement/RecoilState.ts";
import {useRecoilState} from "recoil";
import {PostDto} from "../dtos/post-dto.ts";
import {insertPost, updatePost} from "../services/posts-service.ts";
import PostsList from "./PostsList.tsx";
import PostItem, {PostItemData} from "./PostItem.tsx";
import PostDisplay from "./PostDisplay.tsx";
import AutocompleteInput from "./auto-complete-input.tsx";
import {getAllCities} from "../services/gov-service.ts";
import {useNavigate} from "react-router-dom";


const schema = z.object({
    city: z.string({required_error: "must select city"}),
    street: z.string({required_error: "must select city"}),
    streetNumber: z.number({invalid_type_error: " street number must contain  number value"}).min(1),
    pricePerDay: z.number().min(0),//todo: add validation of length
    description: z.string().min(3, "Name must be longer then 3 charecters").max(500, "Name must be less then 500 charecters"),
})

type FormData = z.infer<typeof schema>

export interface PostProps {
    postToEdit?: PostDto;
    onClosePostForm?: () => void
}


function PostForm(props: PostProps) {
    console.log("In Post Form...")
    const [currDisplayedComp, setCurrDisplayedComp] = useRecoilState(currentDisplayedComponentState);
    const [allFullPosts,  setAllFullPosts] = useRecoilState(fullPostsState);

    const navigate = useNavigate();

    const [city, setCity] = useState<string | undefined>(props.postToEdit ? props.postToEdit.city : '')
    const [street, setStreet] = useState<string | undefined>(props.postToEdit ? props.postToEdit.street : '')
    const [streetNumber, setStreetNumber] = useState<number | undefined>(props.postToEdit ? props.postToEdit.streetNumber : undefined);
    const [pricePerDay, setPricePerDay] = useState<number | undefined>(props.postToEdit ? props.postToEdit.pricePerDay : undefined);
    const [description, setDescription] = useState<string | undefined>(props.postToEdit ? props.postToEdit.description : undefined);
    const [postImgUrl, setPostImgUrl] = useState<string | undefined>(props.postToEdit?.imageUrl);
    const [imgSrc, setImgSrc] = useState<File>();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [allCities, setAllCities] = useState<string[]>(["תל אביב","חיפה"]);

    useEffect(() => {
        getAllCities()
            .then(value => setAllCities(value))
            .catch((error) => console.log("There is a problem to get all Cities list from server... ", error));
    }, []);

    const imgSelected = (e: ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value)
        if (e.target.files && e.target.files.length > 0) {
            setImgSrc(e.target.files[0])
        }
    }
    const selectImg = () => {
        console.log("Selecting post image...")
        fileInputRef.current?.click()
    }

    const getAutoValue = (city: string) => {
        setCity((city));
    }


    const {register, handleSubmit, formState: {errors}} = useForm<FormData>({resolver: zodResolver(schema)})

    const onSubmit = async (data: FieldValues) => {
        if (props.postToEdit) {
            const myPostItemIndex = allFullPosts.findIndex(fullPost => fullPost._id === props.postToEdit!._id);
            let url: string | undefined = allFullPosts[myPostItemIndex].imageUrl;
            //updateing the photo
            if (imgSrc && allFullPosts[myPostItemIndex].imageUrl) {
                try {
                    url = await updatePhoto(allFullPosts[myPostItemIndex].imageUrl, imgSrc);
                    //postToAddOrUpdate = {...postToAddOrUpdate, imageUrl: url} as PostItemData;
                    console.log("Image updated successfully. New URL:", url);
                } catch (error) {
                    console.error("Error updating the image:", error);//todo: alert??
                    url = allFullPosts[myPostItemIndex].imageUrl;
                }
            }

            let postToAddOrUpdate: PostDto = {
                city: city!,
                street: street!,
                streetNumber: streetNumber!,
                description: description!,
                imageUrl: url,
                pricePerDay: pricePerDay!
            } as PostDto

            postToAddOrUpdate = {...postToAddOrUpdate, _id: props.postToEdit._id} as PostDto;
            updatePost(postToAddOrUpdate)
                .then(value => {
                    const myPostItem = {...allFullPosts[myPostItemIndex], ...value, user: allFullPosts[myPostItemIndex].user} as PostItemData;
                    const tempAllFullPosts = [...allFullPosts];
                    tempAllFullPosts[myPostItemIndex] = {...myPostItem};
                    // console.log("about to update postList: ", tempAllFullPosts)
                    // console.log("about to update postList->> updated value: ", myPostItem)
                    setAllFullPosts(tempAllFullPosts);
                    props.onClosePostForm && props.onClosePostForm();
                    setCurrDisplayedComp(<PostDisplay post={myPostItem}/>);//todo:to delete???????? how i navigate to my dialog??
                }).catch(reason => {
                console.log("Failed to update post: ", reason);//todo:1- alert
            })
        } else {
            const url = imgSrc ? await uploadPhoto(imgSrc!) : undefined;
            const postToAddOrUpdate: PostDto = {
                city: city!,
                street: street!,
                streetNumber: streetNumber!,
                description: description!,
                imageUrl: url,
                pricePerDay: pricePerDay!
            } as PostDto

            console.log("uploaded image url:" + url);
            insertPost(postToAddOrUpdate)
                .then(value => {
                    console.log("on then: ", value);
                    navigate('/');
                    setCurrDisplayedComp(<PostsList/>);//todo:to delete
                }).catch(reason => {
                console.log("on error: ", reason);//todo:1- alert
            })
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="vstack gap-3 col-md-7 mx-auto"
              style={{overflowY:"auto", marginTop:"2rem", height:"84vh", backgroundColor:"seashell"}}>
                <h1>New Post</h1>
            <div className="d-flex justify-content-center position-relative">
                <img
                    src={imgSrc ? URL.createObjectURL(imgSrc) : (props.postToEdit && props.postToEdit.imageUrl ? props.postToEdit.imageUrl : appartment)}
                    alt={appartment}
                    style={{height: "230px", width: "230px"}}
                    className="img-fluid"/>
                <button type="button" className="btn position-absolute bottom-0 end-0" onClick={selectImg}>
                    <FontAwesomeIcon icon={faImage} className="fa-xl"/>
                </button>
            </div>
            <input style={{display: "none"}} ref={fileInputRef} type="file" onChange={imgSelected}></input>
            <div className="mb-3 mt-3">
                <label htmlFor="city">City</label>
                <AutocompleteInput suggestions={allCities} onChooseSuggestion={getAutoValue}/>
                {errors.city && <p className="text-danger">{errors.city.message}</p>}
                <input style={{display: "none"}} {...register("city")} type="text" id="city" className="form-control" value={city}/>
            </div>
            <div className="mb-3 mt-3">
                <label htmlFor="street">Street</label>
                <input {...register("street")} type="text" id="street" className="form-control" value={street}
                       onChange={(event) => setStreet(event.target.value)}/>
                {errors.street && <p className="text-danger">{errors.street.message}</p>}
            </div>
            <div className="mb-3">
                <label htmlFor="streetNumber">Street Number</label>
                <input {...register("streetNumber", {valueAsNumber: true})}
                       value={streetNumber}
                       onChange={(event) => setStreetNumber(parseInt(event.target.value))}
                       type="number" id="streetNumber"
                       className="form-control"/>
                {errors.streetNumber && <p className="text-danger">{errors.streetNumber.message}</p>}
            </div>
            <div className="mb-3">
                <label htmlFor="pricePerDay">Price($)</label>
                <input {...register("pricePerDay", {setValueAs: (v) => (v === "" ? undefined : parseInt(v))})}
                       value={pricePerDay}
                       onChange={(event) => setPricePerDay(parseInt(event.target.value))}
                       type="number"
                       id="pricePerDay" className="form-control"/>
                {errors.pricePerDay && <p className="text-danger">{errors.pricePerDay.message}</p>}
            </div>
            <div className="mb-3 mt-3">
                <label htmlFor="description">Description</label>
                <input {...register("description")} type="text" id="description" className="form-control"
                       value={description}
                       onChange={(event) => setDescription(event.target.value)}/>
                {errors.description && <p className="text-danger">{errors.description.message}</p>}
            </div>
            <div className="d-flex justify-content-center position-relative">
                <button type="submit" className="btn btn-primary">Submit</button>
                <button type="button" onClick={() => {props.onClosePostForm ? props.onClosePostForm() : navigate('..')}}
                        className="btn btn-outline-danger">Cancel
                </button>
            </div>
        </form>
    )
}

export default PostForm
