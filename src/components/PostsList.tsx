import {useEffect} from "react"
import PostItem from "./PostItem.tsx"
import {useRecoilState} from "recoil";
import {currentDisplayedComponentState, fullPostsState, userDetailsState} from "../stateManagement/RecoilState.ts";
import PostForm from "./PostForm.tsx";
import {getAllFullPosts} from "../services/posts-service.ts";
import MyProfile from "./MyProfile.tsx";


interface PostData {
    title: string;
    message: string;
    owner: string;
}

function PostsList() {
    const [posts, setPosts] = useRecoilState(fullPostsState);
    const [currDisplayedComp, setCurrDisplayedComp] = useRecoilState(currentDisplayedComponentState);


    useEffect(() => {
        console.log("getAllPost request")
        getAllFullPosts().req.then(res => {
            console.log("Update posts list")
            console.log(res.data);
            setPosts(res.data);
        }).catch((error) => {
            console.log("there was a problem to get  posts list from server...")
        })
        return () => {
            console.log("clean up")
        }
    }, [])
    return (
        <div>
            <div>
                Posts-List
                {posts.map((post, index) => <div><PostItem key={index} post={post}/></div>)}

            </div>
        </div>
    )
}

export default PostsList
