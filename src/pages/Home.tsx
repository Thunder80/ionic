import {
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { Camera, CameraResultType } from "@capacitor/camera";
import { Preferences } from "@capacitor/preferences";

import { useRef, useState } from "react";
import "./Home.css";

interface Pokemon {
  id: string;
  name: string;
  type: string;
}

const Home: React.FC = () => {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [files, setFiles] = useState<{ key: string; value: string }[]>([]);

  const getFiles = async () => {
    const { keys } = await Preferences.keys();
    const newFiles = [];
    for (const key of keys) {
      const { value } = await Preferences.get({ key });
      if (value) newFiles.push({ key, value });
    }

    setFiles(newFiles);
  };

  const getData = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://aiot-backend.onrender.com/pokemon");
      const data = await res.json();
      await Preferences.set(data);

      setPokemon(data.data);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  // const getPhoto = async () => {
  //   const image = await Camera.getPhoto({
  //     quality: 90,
  //     allowEditing: true,
  //     resultType: CameraResultType.Base64,
  //   });

  //   var imageUrl = image.base64String;
  //   console.log(image);

  //   if (!imgRef.current) return;
  //   if (!imageUrl) return;

  //   imgRef.current.src = imageUrl;
  // };

  const sendPhoto = async (file: File) => {
    const formData = new FormData();

    formData.append("file", file);

    const options = {
      method: "POST",
      body: formData,
    };

    const res = await fetch(
      "https://aiot-backend.onrender.com/upload",
      options
    );
    const data = await res.json();
    await Preferences.set({ key: data.key, value: data.value });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Pokemons</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100vw",
          }}
        >
          {!loading ? (
            pokemon.length === 0 ? (
              <IonButton
                onClick={() => {
                  getData();
                }}
              >
                Load
              </IonButton>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  padding: "5px",
                }}
              >
                <IonText style={{ fontSize: "30px", margin: "20px 0px" }}>
                  All Pokemons
                </IonText>
                <IonList>
                  {pokemon.map((e, i) => {
                    return (
                      <IonItem key={i}>
                        <IonLabel>{`${e.name} (${e.type})`}</IonLabel>
                      </IonItem>
                    );
                  })}
                </IonList>
                <IonButton
                  onClick={() => {
                    setPokemon([]);
                  }}
                  style={{ margin: "30px auto", width: "100px" }}
                >
                  Reset
                </IonButton>
              </div>
            )
          ) : (
            <IonText>Loading...</IonText>
          )}
        </div>
        {/* <IonButton onClick={() => getPhoto()}>Take photo</IonButton> */}
        <input
          type="file"
          onChange={(e) => {
            if (e.currentTarget.files && e.currentTarget.files[0])
              setFile(e.currentTarget.files[0]);
          }}
        />
        <IonButton
          onClick={() => {
            if (file) sendPhoto(file);
            else alert("No file selected");
          }}
        >
          Upload
        </IonButton>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            padding: "5px",
          }}
        >
          <IonText style={{ fontSize: "30px", margin: "20px 0px" }}>
            All Files
          </IonText>
          <IonList>
            {files.map((e, i) => {
              return (
                <IonItem key={i}>
                  <IonLabel>{`${e.key} (${e.value})`}</IonLabel>
                </IonItem>
              );
            })}
          </IonList>
          <IonButton
            onClick={() => {
              getFiles();
            }}
            style={{ margin: "30px auto", width: "100px" }}
          >
            Reload
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
