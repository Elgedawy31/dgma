// VideoCallContext.js
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import Peer from "peerjs";
import { mediaDevices } from "react-native-webrtc";
import * as Permissions from "expo-permissions";
import { Platform } from "react-native";
import { Audio } from "expo-av";

const VideoCallContext = createContext();
 
export const useVideoCall = () => useContext(VideoCallContext); 
 export const VideoCallProvider = ({ children }) => {
  const { user: signedUser } = useContext(UseeContext);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState(null);
  const [call, setCall] = useState({});
  const [otherUserId, setOtherUserId] = useState(null);
  const [videoStatus, setVideoStatus] = useState({});
  const [isScreenSharing, setIsScreenSharing] = useState({});

  const userVideoRef = useRef(null);
  const myVideoRef = useRef(null);
  const peerRef = useRef();
  const connectionRef = useRef();
  const soundRef = useRef();

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const { status: cameraStatus } = await Permissions.askAsync(Permissions.CAMERA);
      const { status: audioStatus } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
      return cameraStatus === 'granted' && audioStatus === 'granted';
    }
    return true;
  };

  const getStream = useCallback(async () => {
    try {
      const hasPermissions = await requestPermissions();
      if (!hasPermissions) {
        throw new Error('Permissions not granted');
      }

      const currentStream = await mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(currentStream);
      return currentStream;
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  }, []);

  useEffect(() => {
    if (signedUser) {
      const peer = new Peer(signedUser.id);
      peerRef.current = peer;

      peer.on("call", (incomingCall) => {
        if (incomingCall.metadata.type === "callAction") {
          handleCallAction(incomingCall);
        } else {
          handleIncomingCall(incomingCall);
        }
      });

      peer.on("end", () => {
        cleanupCall();
      });

      // Initialize sound
      initializeSound();

      return () => {
        peer.destroy();
      };
    }
  }, [signedUser]);

  const initializeSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/callSound.mp3'),
        { isLooping: true }
      );
      soundRef.current = sound;
    } catch (error) {
      console.error("Error loading sound:", error);
    }
  };

  const handleCallAction = (incomingCall) => {
    const { action } = incomingCall.metadata;
    switch (action) {
      case "reject":
        handleReject();
        break;
      case "end":
        handleEnd();
        break;
      case "accept":
        setCallAccepted(true);
        break;
      case "toggleVideo":
        setVideoStatus(incomingCall.metadata.payload);
        break;
    }
  };

  const handleIncomingCall = (incomingCall) => {
    setCall({
      isReceivingCall: true,
      from: incomingCall.peer,
      name: incomingCall.metadata.name,
      videoStatus: incomingCall.metadata.videoStatus
    });
    setVideoStatus(incomingCall.metadata.videoStatus);
    setOtherUserId(incomingCall.peer);
    connectionRef.current = incomingCall;
  };

  const callUser = useCallback(
    (otherUserId, type) => {
      setOtherUserId(otherUserId);
      const isVideo = type === "video";
      setVideoStatus({ [signedUser?.id]: isVideo, [otherUserId]: isVideo });

      getStream().then((currentStream) => {
        setStream(currentStream);

        const call = peerRef.current.call(otherUserId, currentStream, {
          metadata: {
            name: signedUser?.name?.first,
            videoStatus: { [signedUser?.id]: isVideo, [otherUserId]: isVideo },
          },
        });

        call.on("stream", (remoteStream) => {
          if (userVideoRef?.current) {
            userVideoRef.current.streamURL = remoteStream.toURL();
          }
        });

        call.on("close", () => {
          leaveCall();
        });

        connectionRef.current = call;
      });
    },
    [signedUser, getStream]
  );

  const answerCall = useCallback(() => {
    setCallAccepted(true);
    getStream().then((currentStream) => {
      connectionRef.current.answer(currentStream);

      connectionRef.current.on("stream", (remoteStream) => {
        if (userVideoRef?.current) {
          userVideoRef.current.streamURL = remoteStream.toURL();
        }
      });

      peerRef.current.call(call.from, new MediaStream(), {
        metadata: { type: "callAction", action: "accept" },
      });
    });
  }, [getStream, call?.from]);

  const leaveCall = useCallback(() => {
    if (otherUserId && peerRef.current) {
      peerRef.current.call(otherUserId, new MediaStream(), {
        metadata: { type: "callAction", action: "end" },
      });
    }

    cleanupCall();
  }, [otherUserId]);

  const cleanupCall = () => {
    setCallEnded(true);
    setOtherUserId(null);

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    setStream(null);
    setVideoStatus({});

    if (connectionRef.current) {
      connectionRef.current.close();
    }
  };

  const toggleMyvideo = useCallback(() => {
    const newStatus = !videoStatus[signedUser?.id];

    if (otherUserId) {
      peerRef.current.call(otherUserId, stream, {
        metadata: {
          type: "callAction",
          action: "toggleVideo",
          payload: {
            [signedUser?.id]: newStatus,
            [otherUserId]: videoStatus[otherUserId],
          },
        },
      });
    }
    setVideoStatus((prevStatus) => ({
      ...prevStatus,
      [signedUser?.id]: newStatus,
    }));
    if (stream) {
      stream.getVideoTracks()[0].enabled = newStatus;
    }
  }, [signedUser, videoStatus, stream, otherUserId]);

  useEffect(() => {
    if (call?.isReceivingCall && !callAccepted) {
      soundRef.current?.playAsync();
    } else {
      soundRef.current?.stopAsync();
    }

    return () => {
      soundRef.current?.stopAsync();
    };
  }, [call, callAccepted]);

  return (
    <VideoCallContext.Provider
      value={{
        call,
        callAccepted,
        myVideoRef,
        userVideoRef,
        stream,
        callEnded,
        callUser,
        leaveCall,
        answerCall,
        videoStatus,
        toggleMyvideo,
        otherUserId,
      }}
    >
      {children}
    </VideoCallContext.Provider>
  );
};

export default VideoCallProvider;