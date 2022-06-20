import { SyntheticEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../../index";

interface Message {
  msg: string;
  roomNumber: string;
}

let textsTemp: Array<Message> = [];

const RoomNumber = () => {
  const [massages, setMassages] = useState<Array<Message>>([]);
  const [up, setUp] = useState<number>(2);

  let { roomNumber } = useParams();

  useEffect(() => {
    if (roomNumber) {
      socket.emit("user-join", roomNumber);
    }

    socket.on("user-message", (msg) => {
      if (msg && roomNumber) {
        textsTemp.push({ msg, roomNumber });
        setMassages(textsTemp);
        setUp(Math.random());
      }
    });

    return () => {
      socket.emit("user-leave", roomNumber);
      socket.off("user-message");
    };
  }, [roomNumber]);

  function handleForm(e: SyntheticEvent): void {
    try {
      e.preventDefault();

      const target = e.target as typeof e.target & {
        msg: { value: string };
      };

      const msg = target.msg.value;

      if (msg.length > 0) {
        socket.emit("chat-user", { roomNumber, msg });
      } else {
        console.log(`the message to short`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <h2>RoomNumber {roomNumber}</h2>
      <form onSubmit={handleForm}>
        <input type="text" name="msg" placeholder="Enter message" />
        <button type="submit">Send</button>
      </form>

      <ul>
        {massages
          .filter((text) => text.roomNumber === roomNumber)
          .map((text, index) => {
            return <li key={index}>{text.msg}</li>;
          })}
      </ul>
    </div>
  );
};

RoomNumber.propTypes = {};

export default RoomNumber;
