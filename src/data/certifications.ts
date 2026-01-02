export interface Certification {
  id: number;
  title: string;
  issuer: string;
  date: string;
  image: string;
  credentialLink: string;
}

export const certifications: Certification[] = [
  {
    id: 1,
    title: 'Bangkit Academy 2023',
    issuer: 'Google, GoTo, Traveloka',
    date: 'Jan 2024',
    image: '/certifications/bangkit.webp',
    credentialLink: 'https://drive.google.com/file/d/1ZF_NikvK0CSqsnp5ffgM1qX0X5e8_gHZ/view?usp=sharing',
  },
  {
    id: 2,
    title: 'TensorFlow Developer Certificate',
    issuer: 'Google',
    date: '2024',
    image: '/certifications/tfdc.webp',
    credentialLink: 'https://www.credential.net/26ca09d8-f7a9-4573-ae59-44a47a713e7f',
  },
  {
    id: 3,
    title: 'Associate Data Scientist',
    issuer: 'BNSP Indonesia',
    date: '2024',
    image: '/certifications/bnsp.webp',
    credentialLink: 'https://drive.google.com/file/d/17Myj5bd3hTOlUwsHEEAKY0XGUX37KtTj/view?usp=sharing',
  },
  {
    id: 4,
    title: 'VSGA Certification - Data Science',
    issuer: 'Komdigi Indonesia',
    date: '2024',
    image: '/certifications/vsga.webp',
    credentialLink: 'https://drive.google.com/file/d/17mJMZOfmzf7xaQ6L_r11ladU35RdlObv/view?usp=sharing',
  },
  {
    id: 5,
    title: 'TOEFL ITP',
    issuer: 'ELTI Gramedia Yogyakarta',
    date: '2025',
    image: '/certifications/toefl.webp',
    credentialLink: 'https://drive.google.com/file/d/1OsOGaKd7dXB3-z-KQifW0DliRIRac1Ak/view?usp=sharing',
  },
  {
    id: 6,
    title: 'TixNow - II Place Best Project',
    issuer: 'Career Vibe Check',
    date: '2025',
    image: '/certifications/tixnow.webp',
    credentialLink: 'https://drive.google.com/file/d/1AfJ8cpjI2pcFVFVjd2vtNNahROOj15QJ/view?usp=sharing',
  },
  {
    id: 7,
    title: 'Nominator Best Project Pitching',
    issuer: 'Career Vibe Check',
    date: '2023',
    image: '/certifications/pitching.webp',
    credentialLink: 'https://drive.google.com/file/d/1RCjC7BYXQKFwuecIxxxhUykKb9iuvqsU/view?usp=sharing',
  },
  {
    id: 8,
    title: 'Laboratory Assistant Certificate',
    issuer: 'Laboratorium Informatika - UPNVY',
    date: '2025',
    image: '/certifications/asistenlab.webp',
    credentialLink: 'https://drive.google.com/file/d/1LKjKKhVWf9eBvRmIM0vsPYlMvLNFyoCX/view?usp=sharing',
  },
  {
    id: 9,
    title: 'POMDA DIY - II Place E-Sport Valorant',
    issuer: 'BAPOMI DIY',
    date: '2024',
    image: '/certifications/pomda.webp',
    credentialLink: 'https://drive.google.com/file/d/1hNUzM6vZcwf77VNSqAWZ7g4AWLLrL7Jq/view?usp=sharing',
  },
  
];
