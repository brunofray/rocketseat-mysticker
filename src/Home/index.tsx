import { useEffect, useState, useRef } from 'react';
import { Image, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as Sharing from 'expo-sharing';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { PositionChoice } from '../components/PositionChoice';

import { styles } from './styles';
import { POSITIONS, PositionProps } from '../utils/positions';
import { Camera, CameraType } from 'expo-camera';

import { captureRef } from 'react-native-view-shot';

export function Home() {
  const [photoURI, setPhotoURI] = useState<null | string>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [positionSelected, setPositionSelected] = useState<PositionProps>(POSITIONS[0]);

  const cameraRef = useRef<Camera>(null);
  const screenShotRef = useRef(null);

  const handleTakePicture = async () => {
    const photo = await cameraRef.current.takePictureAsync();
    setPhotoURI(photo.uri);
  }

  const shareScreenShot = async () => {
    const screenShot = await captureRef(screenShotRef);
    await Sharing.shareAsync("file://" + screenShot);
  }

  useEffect(() => {
    Camera.requestCameraPermissionsAsync()
    .then(response => setHasCameraPermission(response.granted));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View ref={screenShotRef} style={styles.sticker}>
          <Header position={positionSelected} />

          <View style={styles.picture}>

            {
              hasCameraPermission && !photoURI ? 
              <Camera 
                ref={cameraRef}
                style={styles.camera}
                type={CameraType.front}
              />
              :
              <Image 
                source={{ uri: photoURI ?? 'https://github.com/rodrigorgtic.png' }}
                style={styles.camera}
                onLoad={shareScreenShot}
              />
            }

            <View style={styles.player}>
              <TextInput
                placeholder="Digite seu nome aqui"
                style={styles.name}
              />
            </View>
          </View>
        </View>

        <PositionChoice
          onChangePosition={setPositionSelected}
          positionSelected={positionSelected}
        />

        <TouchableOpacity onPress={() => setPhotoURI(null)}>
          <Text style={styles.retry}>Nova foto</Text>
        </TouchableOpacity>

        <Button title="Compartilhar" onPress={handleTakePicture}/>
      </ScrollView>
    </SafeAreaView>
  );
}