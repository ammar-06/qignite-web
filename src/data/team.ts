export interface TeamMember {
  id: string;
  name: string;
  role: string;
  title: string;
  bio: string;
  tagline: string;
  image: string;
  linkedin?: string;
  upwork?: string;
}

export const team: TeamMember[] = [
  {
    id: 'umair-nadeem',
    name: 'Umair Nadeem',
    role: 'CEO',
    title: 'Chief Executive Officer',
    image: '/images/team/umair.jpg',
    linkedin: 'https://www.linkedin.com/company/qignite/',
    upwork: 'https://www.upwork.com/freelancers/umairnadeemqa?mp_source=share',
    tagline: 'Quality. Intelligence. Confidence.',
    bio: 'As CEO of Qignite, I built the company on one core principle: quality is not optional, it\'s the foundation. With expertise in QA Engineering and AI-powered quality assurance, I lead a team focused on delivering reliable, scalable, and top-notch digital products with confidence. At Qignite, we combine traditional QA practices with modern AI tools to create smarter testing workflows, faster delivery cycles, and products users can actually trust. Our mission is simple: build high-quality software through precision, automation, and innovation.',
  },
  {
    id: 'faisal-amin',
    name: 'Faisal Amin',
    role: 'COO',
    title: 'Chief Operating Officer',
    image: '/images/team/faisal.jpg',
    linkedin: 'https://www.linkedin.com/company/qignite/',
    tagline: 'Operational Excellence. Scalable Systems. Reliable Delivery.',
    bio: 'As COO of Qignite, Faisal Amin drives the operational engine behind the company\'s vision, ensuring every project moves with precision, speed, and accountability. With a strong focus on execution, process optimization, and team coordination, he plays a key role in transforming ideas into scalable, high-quality digital solutions. Faisal specializes in building streamlined workflows that bridge technology, quality assurance, and client success.',
  },
  {
    id: 'awais-shah',
    name: 'Awais Shah',
    role: 'Managing Director',
    title: 'Managing Director & QA Lead',
    image: '/images/team/awais.jpg',
    linkedin: 'https://www.linkedin.com/company/qignite/',
    tagline: 'Leadership Through Quality. Execution With Precision.',
    bio: 'As Managing Director at Qignite, Awais Shah plays a central role in shaping the company\'s operational direction while maintaining a strong focus on software quality and delivery excellence. With a background rooted in Quality Assurance, he brings a disciplined and detail-oriented approach to managing projects, teams, and client expectations. Awais combines leadership with technical insight, ensuring that every product reflects reliability, performance, and user trust.',
  },
  {
    id: 'arsalan-aziz',
    name: 'Arsalan Aziz',
    role: 'QA Engineer',
    title: 'QA & Support Engineer',
    image: '/images/team/arsalan.jpg',
    linkedin: 'https://www.linkedin.com/company/qignite/',
    tagline: 'Reliable Support. Strong Quality. Smooth Experience.',
    bio: 'As a QA & Support Engineer at Qignite, Arsalan Aziz plays a vital role in ensuring software reliability while providing efficient technical support that enhances the overall user experience. With a strong focus on troubleshooting, testing, and issue resolution, he helps maintain the performance and stability of products. Arsalan works closely with both development and QA teams to identify problems early and verify system functionality.',
  },
  {
    id: 'dawood-ahmad',
    name: 'Dawood Ahmad',
    role: 'Jr. QA Engineer',
    title: 'Junior QA Engineer',
    image: '/images/team/dawood.jpg',
    linkedin: 'https://www.linkedin.com/company/qignite/',
    tagline: 'Consistency. Accuracy. Continuous Improvement.',
    bio: 'As a Junior QA Engineer at Qignite, Dawood Ahmad contributes to building reliable and high-performing digital products through careful testing, structured validation, and strong attention to detail. Passionate about software quality and continuous learning, he plays an active role in ensuring products meet both functional and user expectations. At Qignite, he represents the next generation of QA professionals combining technical curiosity with a quality-first mindset.',
  },
  {
    id: 'ammar-ahmad',
    name: 'Ammar Ahmad',
    role: 'AI Engineer',
    title: 'AI Engineer',
    image: '/images/team/ammar.jpg',
    linkedin: 'https://www.linkedin.com/in/ammar-ahmad2408/',
    tagline: 'Agentic Systems. Real-World Deployment. Measurable Impact.',
    bio: 'As an AI Engineer at Qignite, I focus on building intelligent systems that don\'t just respond but think, plan, and act. My work centers around designing agentic AI solutions that automate complex workflows, optimize business operations, and deliver measurable impact. I specialize in developing multi-agent architectures where Large Language Models function as reasoning engines, capable of decision-making, tool integration, and execution across dynamic environments.',
  },
];