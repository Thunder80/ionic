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
import { useState } from "react";
import "./Home.css";

interface Pokemon {
  id: string;
  name: string;
  type: string;
}

const Home: React.FC = () => {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://aiot-backend.onrender.com/pokemon");
      const data = await res.json();

      setPokemon(data.data);
    } catch {
    } finally {
      setLoading(false);
    }
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
      </IonContent>
    </IonPage>
  );
};

export default Home;
