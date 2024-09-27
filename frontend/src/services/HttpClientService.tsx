import { LogInterface } from "../interfaces/ILog";
import { SignInInterface } from "../interfaces/ISignIn";
import { UserInterface } from "../interfaces/IUser";
import { LikeInterface } from "../interfaces/ILike";
import { SaveInterface } from "../interfaces/ISave";
import { MusicInterface } from "../interfaces/IMusic";
import { FollowerInterface } from "../interfaces/IFollower";

const apiUrl = `http://localhost:8080`;

const requestOptionsGet = {
    method: "GET",
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
    },
}

interface SearchLogsParams {
    userID: number | null;  // Adjust type if needed
    keyword?: string;
    moodID?: number | null;
    categoryID?: number | null;
    liked?: boolean;
    saved?: boolean;
}

interface SearchMusicsParams {
    artist?: string;
    name?: string;
    moodID?: number | null;
}

interface FollowerParams {
    UserID?: number | null;  // Adjust type if needed
    FollowerID?: number | null;  // Adjust type if needed
}

async function Login(data: SignInInterface) {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    };

    let res = await fetch(`${apiUrl}/login`, requestOptions)
        .then((response) => response.json())
        .then((res) => {
            if (res.data) {
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("uid", res.data.id);
                localStorage.setItem("firstname", res.data.firstname);
                localStorage.setItem("lastname", res.data.lastname);
                localStorage.setItem("role", res.data.role);
                return res.data;
            } else {
                return false;
            }
        });

    return res;
}

const SignUpUser = async (data: UserInterface) => {
    const requestOptions = {
        method: "POST",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };

    let res = await fetch(`${apiUrl}/signup`, requestOptions)
        .then((response) => response.json())
        .then((res) => {
            if (res.data) {
                return { status: true, message: res.data };
            } else {
                return { status: false, message: res.error };
            }
        });

    return res;
}

async function GetUser() {
    const id = localStorage.getItem("uid");

    let res = await fetch(`${apiUrl}/user/${id}`, requestOptionsGet)
        .then((response) => response.json())
        .then((res) => {
            return res.data ? res.data : false;
        });

    return res;
}

async function ListUsers() {
    let res = await fetch(`${apiUrl}/users`, requestOptionsGet)
        .then((response) => response.json())
        .then((res) => {
            if (res.data) {
                return res.data;
            } else {
                return false;
            }
        });

    return res;
}

async function UpdateUser(data: UserInterface) {
    const requestOptions = {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };

    let res = await fetch(`${apiUrl}/users`, requestOptions)
        .then((response) => response.json())
        .then((res) => {
            if (res.data) {
                return { status: true, message: res.data };
            } else {
                return { status: false, message: res.error };
            }
        });

    return res;
}

async function DeleteUser(id: string) {
    const requestOptions = {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
        },
    };

    let res = await fetch(`${apiUrl}/user/${id}`, requestOptions)
        .then((response) => response.json())
        .then((res) => {
            return res.data ? res.data : false;
        });

    return res;
}

async function CreateLog(data: LogInterface) {
    const requestOptions = {
        method: "POST",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };

    let res = await fetch(`${apiUrl}/log`, requestOptions)
        .then((response) => response.json())
        .then((res) => {
            if (res.data) {
                return { status: true, message: res.data };
            } else {
                return { status: false, message: res.error };
            }
        });

    return res;
};

async function GetLog(id: any) {
    let res = await fetch(`${apiUrl}/log/${id}`, requestOptionsGet)
        .then((response) => response.json())
        .then((res) => {
            return res.data ? res.data : false;
        });

    return res;
}

async function GetMostLikeLog() {
    let res = await fetch(`${apiUrl}/mostLike/${localStorage.getItem('uid')}`, requestOptionsGet)
        .then((response) => response.json())
        .then((res) => {
            return res.data ? res.data : false;
        });

    return res;
}

async function GetMostSaveLog() {
    let res = await fetch(`${apiUrl}/mostSave/${localStorage.getItem('uid')}`, requestOptionsGet)
        .then((response) => response.json())
        .then((res) => {
            return res.data ? res.data : false;
        });

    return res;
}

async function SearchLogs({
    userID,
    keyword,
    moodID,
    categoryID,
    liked,
    saved,
}: SearchLogsParams) {
    // Create query parameters
    const params: string[] = [];

    if (userID) params.push(`user_id=${userID}`);
    if (keyword) params.push(`keyword=${encodeURIComponent(keyword)}`);
    if (moodID) params.push(`mood_id=${moodID}`);
    if (categoryID) params.push(`category_id=${categoryID}`);
    if (liked) params.push(`liked=${liked}`);
    if (saved) params.push(`saved=${saved}`);

    // Construct the full API URL
    const url = `${apiUrl}/logs?${params.join("&")}`;

    try {
        let res = await fetch(url, requestOptionsGet)
            .then((response) => response.json())
            .then((res) => {
                if (res.data) {
                    return res.data ? res.data : false;
                }
            });

        return res;
    } catch (error) {
        console.error('Error fetching logs:', error);
        throw error;
    }

}

async function ListLogs() {
    let res = await fetch(`${apiUrl}/logs`, requestOptionsGet)
        .then((response) => response.json())
        .then((res) => {
            if (res.data) {
                return res.data;
            } else {
                return false;
            }
        });

    return res;
}

async function ListLogsByUID(id: number) {
    let res = await fetch(`${apiUrl}/logs/${id}`, requestOptionsGet)
        .then((response) => response.json())
        .then((res) => {
            if (res.data) {
                return res.data;
            } else {
                return false;
            }
        });

    return res;
}

async function UpdateLog(data: LogInterface) {
    const requestOptions = {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };

    let res = await fetch(`${apiUrl}/logs`, requestOptions)
        .then((response) => response.json())
        .then((res) => {
            if (res.data) {
                return { status: true, message: res.data };
            } else {
                return { status: false, message: res.error };
            }
        });

    return res;
}

async function DeleteLog(id: string) {
    const requestOptions = {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
        },
    };

    let res = await fetch(`${apiUrl}/log/${id}`, requestOptions)
        .then((response) => response.json())
        .then((res) => {
            return res.data ? res.data : false;
        });

    return res;
}

async function ListMoods() {
    let res = await fetch(`${apiUrl}/moods`, requestOptionsGet)
        .then((response) => response.json())
        .then((res) => {
            if (res.data) {
                return res.data;
            } else {
                return false;
            }
        });

    return res;
}

async function CreateMusic(data: MusicInterface) {
    const requestOptions = {
        method: "POST",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };

    let res = await fetch(`${apiUrl}/music`, requestOptions)
        .then((response) => response.json())
        .then((res) => {
            if (res.data) {
                return { status: true, message: res.data };
            } else {
                return { status: false, message: res.error };
            }
        });

    return res;
};

async function ListMusics() {
    let res = await fetch(`${apiUrl}/musics`, requestOptionsGet)
        .then((response) => response.json())
        .then((res) => {
            if (res.data) {
                return res.data;
            } else {
                return false;
            }
        });

    return res;
}

async function SearchMusics({
    artist,
    name,
    moodID,
}: SearchMusicsParams) {
    // Create query parameters
    const params: string[] = [];

    if (artist) params.push(`artist=${encodeURIComponent(artist)}`);
    if (name) params.push(`name=${encodeURIComponent(name)}`);
    if (moodID) params.push(`mood_id=${encodeURIComponent(moodID)}`);

    // Construct the full API URL
    const url = `${apiUrl}/musics?${params.join("&")}`;

    try {
        let res = await fetch(url, requestOptionsGet)
            .then((response) => response.json())
            .then((res) => {
                if (res.data) {
                    return res.data;
                } else {
                    return false;
                }
            });

        return res;
    } catch (error) {
        console.error('Error fetching logs:', error);
        throw error;
    }

}

async function ListCategories() {
    let res = await fetch(`${apiUrl}/categories`, requestOptionsGet)
        .then((response) => response.json())
        .then((res) => {
            if (res.data) {
                return res.data;
            } else {
                return false;
            }
        });

    return res;
}

async function AddLike(data: LikeInterface) {
    const requestOptions = {
        method: "POST",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };

    let res = await fetch(`${apiUrl}/like`, requestOptions)
        .then((response) => response.json())
        .then((res) => {
            if (res.data) {
                return { status: true, message: res.data };
            } else {
                return { status: false, message: res.error };
            }
        });

    return res;
};

async function UnLike(id: number) {
    const uid = localStorage.getItem("uid")
    const requestOptions = {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
        },
    };

    let res = await fetch(`${apiUrl}/like?log_id=${id}&user_id=${uid}`, requestOptions)
        .then((response) => response.json())
        .then((res) => {
            return res.data ? res.data : false;
        });

    return res;
}

async function GetLikeByLogID(id: number) {
    let res = await fetch(`${apiUrl}/like/${id}`, requestOptionsGet)
        .then((response) => response.json())
        .then((res) => {
            return res.data ? res.data : false;
        });

    return res;
}

async function AddSave(data: SaveInterface) {
    const requestOptions = {
        method: "POST",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };

    let res = await fetch(`${apiUrl}/save`, requestOptions)
        .then((response) => response.json())
        .then((res) => {
            if (res.data) {
                return { status: true, message: res.data };
            } else {
                return { status: false, message: res.error };
            }
        });

    return res;
};

async function UnSave(id: number) {
    const uid = localStorage.getItem("uid")
    const requestOptions = {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
        },
    };

    let res = await fetch(`${apiUrl}/save?log_id=${id}&user_id=${uid}`, requestOptions)
        .then((response) => response.json())
        .then((res) => {
            return res.data ? res.data : false;
        });

    return res;
}

async function GetSaveByLogID(id: number) {
    let res = await fetch(`${apiUrl}/save/${id}`, requestOptionsGet)
        .then((response) => response.json())
        .then((res) => {
            return res.data ? res.data : false;
        });

    return res;
}

async function FollowUser(data: FollowerInterface) {
    const requestOptions = {
        method: "POST",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };

    let res = await fetch(`${apiUrl}/follow`, requestOptions)
        .then((response) => response.json())
        .then((res) => {
            if (res.data) {
                return { status: true, message: res.data };
            } else {
                return { status: false, message: res.error };
            }
        });

    return res;
};

async function GetFollowerByUID({
    UserID,
    FollowerID
}: FollowerParams) {
    // Create query parameters
    const params: string[] = [];

    if (UserID) params.push(`user_id=${UserID}`);
    if (FollowerID) params.push(`follower_id=${FollowerID}`);

    // Construct the full API URL
    const url = `${apiUrl}/followers?${params.join("&")}`;

    let res = await fetch(url, requestOptionsGet)
        .then((response) => response.json())
        .then((res) => {
            return res.data ? res.data : false;
        });

    return res;
}

async function UnfollowUser(data: FollowerInterface) {
    const requestOptions = {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };

    let res = await fetch(`${apiUrl}/unfollow`, requestOptions)
        .then((response) => response.json())
        .then((res) => {
            if (res.data) {
                return { status: true, message: res.data };
            } else {
                return { status: false, message: res.error };
            }
        });

    return res;
};


export {
    Login,
    SignUpUser,
    GetUser,
    ListUsers,
    UpdateUser,
    DeleteUser,
    CreateLog,
    GetLog,
    GetMostLikeLog,
    GetMostSaveLog,
    SearchLogs,
    ListLogs,
    ListLogsByUID,
    UpdateLog,
    DeleteLog,
    ListMoods,
    CreateMusic,
    ListMusics,
    SearchMusics,
    ListCategories,
    AddLike,
    UnLike,
    GetLikeByLogID,
    AddSave,
    UnSave,
    GetSaveByLogID,
    FollowUser,
    GetFollowerByUID,
    UnfollowUser,
}