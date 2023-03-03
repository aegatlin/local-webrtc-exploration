const local = new RTCPeerConnection();

const createOfferButton = document.getElementById("create-offer");
createOfferButton.onclick = () => {
  localDataChannel();

  local.createOffer().then((offer) => {
    const div = document.getElementById("offer");
    div.innerText = offer.sdp;
    local.setLocalDescription(offer);
  });

  local.addEventListener("icecandidate", (e) => {
    const div = document.getElementById("candidates");
    if (!e.candidate) return;
    const iCan = JSON.stringify(e.candidate.toJSON());
    const child = document.createElement("div");
    child.innerText = iCan;
    div.appendChild(child);
  });
};

const createAnswerButton = document.getElementById("create-answer");
createAnswerButton.onclick = () => {
  const peerOfferSDP = document.getElementById("peer-offer").value;
  const peerIceCandidates = document
    .getElementById("peer-ice-candidates")
    .value.split("\n")
    .map((iCandidate) => {
      const info = JSON.parse(iCandidate);
      return new RTCIceCandidate(info);
    });

  local.setRemoteDescription({ type: "offer", sdp: peerOfferSDP }).then(() => {
    local.createAnswer().then((answer) => {
      const div = document.getElementById("answer");
      div.innerText = answer.sdp;
      local.setLocalDescription(answer).then(() => {
        peerIceCandidates.forEach((iCandidate) => {
          console.log("??????????????????");
          local.addIceCandidate(iCandidate);
        });
      });
    });
  });

  local.addEventListener("icecandidate", (e) => {
    const div = document.getElementById("answer-candidates");
    if (!e.candidate) return;
    const iCan = JSON.stringify(e.candidate.toJSON());
    const child = document.createElement("div");
    child.innerText = iCan;
    div.appendChild(child);
  });
};

// function init() {
//   local.createOffer().then((offer) => {
//     console.log("offer", offer);
//     const div = document.getElementById("offer");
//     const child = document.createElement("div");
//     child.innerText = offer.sdp;
//     div.appendChild(child);
//     local.setLocalDescription(offer);
//     // remote.setRemoteDescription(offer);
//     // remote.createAnswer().then((answer) => {
//     //   remote.setLocalDescription(answer);
//     //   local.setRemoteDescription(answer);
//     // });
//   });

//   localDataChannel();
//   localIce();
//   // remoteListeners();
//   // localDataChannel();
//   // remoteDataChannel();
// }

function localDataChannel() {
  const dataChannel = local.createDataChannel("test");

  dataChannel.addEventListener("open", (e) => {
    console.log("local datachannel open", e);
    dataChannel.send("hello from local");
  });

  dataChannel.addEventListener("message", (e) => {
    console.log("local message received", e, e.data);
  });
}

// function remoteDataChannel() {
//   remote.addEventListener("datachannel", (e) => {
//     console.log("remote datachannel event", e);
//     const dataChannel = e.channel;
//     dataChannel.addEventListener("open", (e) => {
//       console.log("remote datachannel open", e);
//       dataChannel.send("hello from remote");
//     });

//     dataChannel.addEventListener("message", (e) => {
//       console.log("remote message received", e, e.data);
//     });
//   });
// }

// init();
