import React from "react";
import LaptopIcon from "@material-ui/icons/Laptop";
import Divider from "@material-ui/core/Divider";
import logo from "../images/logo-bitmessage.png";
import "./ChatLandingScreen.css";
import Zoom from "@material-ui/core/Zoom";

function ChatLandingScreen({ showLandingScreenPhoto }) {
  return (
    <div className="chat-landing-screen">
      <div>
         <h1>Bitmessage Chat</h1>
          <img
            className="chat-landing-screen__photo"
            src={logo}
            alt="whatsAppConnected"
          />
      
      </div>

      <div>
        <p>
          <strong>BitMessage</strong> é um protocolo de comunicação descentralizado, criptografado, ponto a ponto e sem confiança que pode ser usado por uma pessoa para enviar mensagens criptografadas para outra pessoa ou para vários assinantes.
        </p>
      </div>

      {/* <Divider />

      <div className="chat-landing-screen__footer">
        <LaptopIcon />
        <p>WhatsApp is available for Windows.</p>
        <a
          target="_blank"
          href="https://www.whatsapp.com/download"
          rel="noopener noreferrer"
        >
          Get it here.
        </a>
      </div> */}
    </div>
  );
}

export default ChatLandingScreen;
