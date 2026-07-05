// lib/categories/music.ts

const music = {
  // ============================
  // 🎸 Musique → Instruments → Guitares
  // ============================
  guitar: { category: "Guitares", parent: "Instruments", root: "Musique" },
  guitars: { category: "Guitares", parent: "Instruments", root: "Musique" },
  guitare: { category: "Guitares", parent: "Instruments", root: "Musique" },
  gitarre: { category: "Guitares", parent: "Instruments", root: "Musique" }, // DE

  // ============================
  // 🎹 Musique → Instruments → Pianos
  // ============================
  piano: { category: "Pianos", parent: "Instruments", root: "Musique" },
  keyboard: { category: "Pianos", parent: "Instruments", root: "Musique" },
  klavier: { category: "Pianos", parent: "Instruments", root: "Musique" }, // DE

  // ============================
  // 🥁 Musique → Instruments → Batteries
  // ============================
  drum: { category: "Batteries", parent: "Instruments", root: "Musique" },
  drums: { category: "Batteries", parent: "Instruments", root: "Musique" },
  batterie: { category: "Batteries", parent: "Instruments", root: "Musique" },
  schlagzeug: { category: "Batteries", parent: "Instruments", root: "Musique" }, // DE

  // ============================
  // 🎤 Musique → Audio → Microphones
  // ============================
  microphone: { category: "Microphones", parent: "Audio", root: "Musique" },
  mic: { category: "Microphones", parent: "Audio", root: "Musique" },
  mikrofon: { category: "Microphones", parent: "Audio", root: "Musique" }, // DE

  // ============================
  // 🎧 Musique → Audio → Casques studio
  // ============================
  studio_headphones: { category: "Casques studio", parent: "Audio", root: "Musique" },
  casque_studio: { category: "Casques studio", parent: "Audio", root: "Musique" },
  studio_kopfhörer: { category: "Casques studio", parent: "Audio", root: "Musique" }, // DE

  // ============================
  // 🎛 Musique → Production → Interfaces audio
  // ============================
  audio_interface: { category: "Interfaces audio", parent: "Production", root: "Musique" },
  soundcard: { category: "Interfaces audio", parent: "Production", root: "Musique" },
  carte_son: { category: "Interfaces audio", parent: "Production", root: "Musique" },
  audiointerface: { category: "Interfaces audio", parent: "Production", root: "Musique" }, // DE

  // ============================
  // 🎚 Musique → Production → Mixeurs
  // ============================
  mixer: { category: "Mixeurs audio", parent: "Production", root: "Musique" },
  mixeur: { category: "Mixeurs audio", parent: "Production", root: "Musique" },
  mischpult: { category: "Mixeurs audio", parent: "Production", root: "Musique" }, // DE

  // ============================
  // 💿 Musique → Médias → Vinyles
  // ============================
  vinyl: { category: "Vinyles", parent: "Médias", root: "Musique" },
  record: { category: "Vinyles", parent: "Médias", root: "Musique" },
  schallplatte: { category: "Vinyles", parent: "Médias", root: "Musique" }, // DE

  // ============================
  // 💿 Musique → Médias → CD
  // ============================
  cd: { category: "CD", parent: "Médias", root: "Musique" },
  compact_disc: { category: "CD", parent: "Médias", root: "Musique" },
  cd_de: { category: "CD", parent: "Médias", root: "Musique" }, // DE variation
};

export default music;
