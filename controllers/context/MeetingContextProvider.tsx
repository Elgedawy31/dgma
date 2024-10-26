// import React, { createContext, useContext, useState, useCallback } from "react";
// import { useMeetingManager } from "amazon-chime-sdk-component-library-react";
// import { MeetingSessionConfiguration } from "amazon-chime-sdk-js";
// import axios from "axios";
// import Cookies from "js-cookie";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";

// const MeetingRoomContext = createContext();

// const DeviceLabels = {
//   audio: true,
//   video: true,
// };

// export function MeetingRoomProvider({ children }) {
//   const navigate = useNavigate();
//   const { user } = useSelector((state) => state.auth);
  
//   const [attendees, setAttendees] = useState([]);
//   const [allMeetings, setAllMeetings] = useState([]);
//   const [meetingSession, setMeetingSession] = useState(null);
//   const meetingManager = useMeetingManager();

//   const getAllMeetings = useCallback(async () => {
//     const token = Cookies.get("token");
//     try {
//       const response = await axios.get(
//         `${import.meta.env.VITE_API_BASE_URL}/api/meet/`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setAllMeetings(response.data);
//     } catch (error) {
//       console.error("Error fetching meetings:", error);
//     }
//   }, []);

//   const createMeeting = async () => {
//     const token = Cookies.get("token");
//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_API_BASE_URL}/api/meet/`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setMeetingSession(response.data.Meeting);
//       getAllMeetings();
//       return response.data.Meeting;
//     } catch (error) {
//       console.error("Error creating meeting:", error);
//       throw error;
//     }
//   };


//   const deleteAttendee = async (meetingId) => {
//     const token = Cookies.get("token");

//     const userAddtendeeId = attendees.find((a) => a.ExternalUserId === user?.id)?.AttendeeId;

//     try {
//       await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/meet/delete-user`, {
//         data: { meetingId ,userId:user?.id , attendeId:userAddtendeeId },
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//     } catch (error) {
//       console.error("Error joining meeting:", error);
//     }
//   };

//   const joinMeeting = async (meetingId = null) => {
//     if(!meetingId || !allMeetings) return
    
//     try {
//       const meeting =  allMeetings?.find((m) => m.MeetingId === meetingId)
//       const attendee = await addAttendee(meeting.MeetingId);

//       const meetingSessionConfiguration = new MeetingSessionConfiguration(
//         meeting,
//         attendee
//       );
//       await meetingManager.join(meetingSessionConfiguration, {
//         deviceLabels: DeviceLabels,
//       });

//       await meetingManager.start();
//       setMeetingSession(meetingManager.meetingSession);
//       navigate(`/Meeting/${meeting.MeetingId}`);
//     } catch (error) {
//       console.error("Error joining meeting:", error);
//     }
//   };

//   const leaveMeeting = async () => {
//     const token = Cookies.get("token");
//     try {
//       const currentAttendees = await getAttendees(
//         meetingSession.configuration.meetingId
//       );

//       if (currentAttendees.Attendees.length === 1) {
//         await deleteAttendee(meetingSession.configuration.meetingId);
//         await meetingManager.leave();
//         await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/meet/`, {
//           data: { meetingId: meetingSession.configuration.meetingId },
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//       } else {
//         await deleteAttendee(meetingSession.configuration.meetingId);
//         const currentAttendees = await getAttendees(
//           meetingSession.configuration.meetingId
//         );
//         await meetingManager.leave();
//       }
//       setMeetingSession(null);
//       navigate(`/meetingRoom`);
//     } catch (error) {
//       console.error("Error leaving meeting:", error);
//     }
//   };

//   const addAttendee = async (meetingId) => {
//     const token = Cookies.get("token");
//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_API_BASE_URL}/api/meet/add-user`,
//         {
//           userId: JSON.parse(localStorage.getItem("user"))?.id,
//           meetingId: meetingId,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setAttendees((prev) => [...prev, response.data.Attendee]);
//       getAttendees(meetingId);
//       return response.data.Attendee;
//     } catch (error) {
//       console.error("Error adding attendee:", error);
//       throw error;
//     }
//   };

//   const getAttendees = async (meetingId) => {
//     const token = Cookies.get("token");
//     try {
//       const response = await axios.get(
//         `${
//           import.meta.env.VITE_API_BASE_URL
//         }/api/meet/attendees?meetingId=${meetingId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       return response.data;
//     } catch (error) {
//       console.error("Error getting attendees:", error);
//       throw error;
//     }
//   };

//   async function deleteMeeting(meetingId) {
//     const token = Cookies.get("token");

//     try {
//       await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/meet/`, {
//         data: { meetingId: meetingId },
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       getAllMeetings();
//     } catch (error) {
//       console.error("Error deleting meetings:", error);
//     }
//   }

//   const value = {
//     attendees,
//     allMeetings,
//     meetingSession,
//     DeviceLabels,
//     createMeeting,
//     joinMeeting,
//     deleteAttendee,
//     leaveMeeting,
//     getAllMeetings,
//     getAttendees,
//     deleteMeeting,
//   };


//   return (
//     <MeetingRoomContext.Provider value={value}>
//       {children}
//     </MeetingRoomContext.Provider>
//   );
// }

// export function useMeetingRoom() {
//   const context = useContext(MeetingRoomContext);
//   if (!context) {
//     throw new Error("useMeetingRoom must be used within a MeetingRoomProvider");
//   }
//   return context;
// }
