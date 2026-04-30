export interface User {
  id: string; name: string; email: string;
  role: 'student' | 'professor' | 'admin';
  department?: string; title?: string; avatar?: string;
}

export interface Workshop {
  id: string; title: string; description: string;
  department: string; topic: string; date: string; time: string;
  location: string; type: 'in-person' | 'webinar';
  status: 'upcoming' | 'past' | 'pending' | 'approved' | 'rejected';
  professor: { id: string; name: string; title: string };
  capacity: number; enrolled: number;
  resources?: Array<{ name: string; type: string; url: string }>;
  targetAudience?: string; tags?: string[];
}

export interface Certificate {
  id: string; workshopId: string; workshopTitle: string;
  studentId: string; studentName: string; issuedAt: string; grade: string;
}

export interface Message {
  id: string; from: string; fromRole: string;
  subject: string; body: string; date: string; read: boolean;
}

export const mockWorkshops: Workshop[] = [
  { id:'1', title:'Introduction to Neural Networks', description:'Learn the fundamentals of neural networks from perceptrons to deep architectures. This hands-on workshop covers backpropagation, activation functions, and practical implementations using Python and TensorFlow.', department:'Computer Science', topic:'Deep Learning', date:'2026-05-10', time:'09:00', location:'Amphithéâtre A, Bâtiment Informatique', type:'in-person', status:'upcoming', professor:{id:'prof1',name:'Dr. Meriem Hadj',title:'Associate Professor'}, capacity:60, enrolled:47, targetAudience:'Master 1 & 2 students', tags:['Python','TensorFlow','Deep Learning'], resources:[{name:'Slides – Neural Networks Basics',type:'slides',url:'#'},{name:'Lab Notebook (Jupyter)',type:'code',url:'#'}] },
  { id:'2', title:'Natural Language Processing with Transformers', description:'Dive deep into modern NLP using transformer architectures. Understand BERT, GPT and their variants, and build real applications for sentiment analysis and text generation.', department:'Computer Science', topic:'NLP', date:'2026-05-18', time:'14:00', location:'Salle Multimédia 101', type:'in-person', status:'upcoming', professor:{id:'prof2',name:'Dr. Karim Saadi',title:'Professor'}, capacity:40, enrolled:38, targetAudience:'All students', tags:['NLP','Transformers','BERT'], resources:[{name:'Introduction to Transformers (PDF)',type:'pdf',url:'#'}] },
  { id:'3', title:'Computer Vision & Image Recognition', description:'Master convolutional neural networks and modern computer vision techniques. Build image classifiers, object detectors, and explore generative models like GANs.', department:'Engineering', topic:'Computer Vision', date:'2026-05-25', time:'10:00', location:'Labo Vision par Ordinateur', type:'webinar', status:'upcoming', professor:{id:'prof3',name:'Dr. Faiza Benali',title:'Lecturer'}, capacity:80, enrolled:52, targetAudience:'Engineering & CS students', tags:['CNN','PyTorch','OpenCV'], resources:[] },
  { id:'4', title:'AI Ethics & Responsible Machine Learning', description:'Explore the ethical dimensions of AI systems: bias, fairness, transparency, and accountability. Learn frameworks for developing responsible AI in real-world contexts.', department:'Philosophy & Social Sciences', topic:'AI Ethics', date:'2026-06-02', time:'14:30', location:'Amphithéâtre B', type:'in-person', status:'upcoming', professor:{id:'prof4',name:'Dr. Rania Meziane',title:'Senior Researcher'}, capacity:100, enrolled:61, targetAudience:'All faculties', tags:['Ethics','Fairness','Policy'], resources:[{name:'AI Ethics Framework (PDF)',type:'pdf',url:'#'}] },
  { id:'5', title:'Data Science & Machine Learning Pipeline', description:'From raw data to production ML models. Learn data cleaning, feature engineering, model selection, hyperparameter tuning, and MLOps fundamentals.', department:'Mathematics', topic:'Machine Learning', date:'2026-04-12', time:'09:00', location:'Salle Informatique 205', type:'in-person', status:'past', professor:{id:'prof5',name:'Dr. Yacine Bouziane',title:'Associate Professor'}, capacity:50, enrolled:50, targetAudience:'Master students', tags:['Scikit-learn','Pandas','MLOps'], resources:[{name:'Workshop Recording',type:'video',url:'#'},{name:'Dataset & Notebooks',type:'code',url:'#'}] },
  { id:'6', title:'Reinforcement Learning: From Theory to Games', description:'Understand Markov decision processes, Q-learning, policy gradients and train AI agents to play classic games and solve complex control tasks.', department:'Computer Science', topic:'Reinforcement Learning', date:'2026-04-05', time:'11:00', location:'Webinar en ligne', type:'webinar', status:'past', professor:{id:'prof1',name:'Dr. Meriem Hadj',title:'Associate Professor'}, capacity:60, enrolled:58, targetAudience:'Advanced students', tags:['RL','OpenAI Gym','PyTorch'], resources:[{name:'RL Slides (PDF)',type:'slides',url:'#'}] },
  { id:'7', title:'Generative AI with Diffusion Models', description:'Explore the mathematics behind diffusion models and learn to generate images, audio and text. Hands-on with Stable Diffusion and fine-tuning techniques.', department:'Computer Science', topic:'Generative AI', date:'2026-06-15', time:'10:00', location:'Amphithéâtre A', type:'in-person', status:'pending', professor:{id:'prof2',name:'Dr. Karim Saadi',title:'Professor'}, capacity:50, enrolled:0, targetAudience:'Master 2 & PhD', tags:['Diffusion','Stable Diffusion','GenAI'], resources:[] },
  { id:'8', title:'AI in Healthcare: Diagnostic Systems', description:'Apply machine learning to medical imaging, clinical prediction, and drug discovery. Guest lectures from practitioners at CHU Blida.', department:'Medicine', topic:'AI in Healthcare', date:'2026-06-20', time:'09:30', location:'Salle de Conférence, Faculté Médecine', type:'in-person', status:'approved', professor:{id:'prof4',name:'Dr. Rania Meziane',title:'Senior Researcher'}, capacity:70, enrolled:0, targetAudience:'Medicine & Engineering students', tags:['Healthcare','Medical Imaging','Clinical AI'], resources:[] },
];

export const mockCertificates: Certificate[] = [
  { id:'cert1', workshopId:'5', workshopTitle:'Data Science & Machine Learning Pipeline', studentId:'stu1', studentName:'Amine Bensaid', issuedAt:'2026-04-13', grade:'Excellent' },
  { id:'cert2', workshopId:'6', workshopTitle:'Reinforcement Learning: From Theory to Games', studentId:'stu1', studentName:'Amine Bensaid', issuedAt:'2026-04-06', grade:'Very Good' },
];

export const mockMessages: Message[] = [
  { id:'msg1', from:'Dr. Meriem Hadj', fromRole:'Professor', subject:'Workshop materials uploaded', body:'Hello, I have uploaded all workshop materials for the Neural Networks session. Please review and let me know if anything needs adjustment before the session on May 10.', date:'2026-04-18', read:false },
  { id:'msg2', from:'Amine Bensaid', fromRole:'Student', subject:'Certificate request', body:'Hello admin, I completed the ML Pipeline workshop but my certificate has not been issued yet. Could you please check? My student ID is stu1.', date:'2026-04-17', read:false },
  { id:'msg3', from:'Dr. Karim Saadi', fromRole:'Professor', subject:'Venue change for NLP workshop', body:'I need to change the venue for the NLP Transformers workshop from Salle 101 to Amphithéâtre B due to high enrollment numbers.', date:'2026-04-15', read:true },
  { id:'msg4', from:'Lina Khelil', fromRole:'Student', subject:'Registration issue', body:'I tried to register for the Computer Vision workshop but received an error saying the system was unavailable. Could you help me resolve this?', date:'2026-04-14', read:true },
];

export const analyticsData = {
  totalStudents: 384, totalProfessors: 22, totalWorkshops: 18, certificatesIssued: 215,
  monthlyEnrollments: [
    {month:'Jan',enrollments:32},{month:'Feb',enrollments:48},{month:'Mar',enrollments:61},
    {month:'Apr',enrollments:77},{month:'May',enrollments:54},{month:'Jun',enrollments:89},
  ],
  workshopsByDepartment: [
    {department:'Computer Science',count:8},{department:'Engineering',count:3},
    {department:'Mathematics',count:2},{department:'Medicine',count:2},{department:'Other',count:3},
  ],
};

export const departments = ['Computer Science','Mathematics','Physics','Engineering','Biology','Chemistry','Economics','Medicine','Philosophy & Social Sciences'];
export const aiTopics = ['Machine Learning','Deep Learning','NLP','Computer Vision','Reinforcement Learning','AI Ethics','Generative AI','Data Science','AI in Healthcare','AI in Finance','Robotics'];
