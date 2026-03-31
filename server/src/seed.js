require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const Admin = require('./models/Admin')
const Project = require('./models/Project')
const Skill = require('./models/Skill')
const About = require('./models/About')
const Experience = require('./models/Experience')

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('✅ Connected to MongoDB')

  // Clear existing data
  await Promise.all([
    Admin.deleteMany({}),
    Project.deleteMany({}),
    Skill.deleteMany({}),
    About.deleteMany({}),
    Experience.deleteMany({}),
  ])
  console.log('🧹 Cleared existing data')

  // Admin
  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'sharjeel2024', 12)
  await Admin.create({ username: process.env.ADMIN_USERNAME || 'admin', passwordHash })
  console.log(`👤 Admin created: ${process.env.ADMIN_USERNAME || 'admin'}`)

  // About
  await About.create({
    bio: "I'm a passionate Computer Science student (Semester 6) from Gujranwala, Pakistan, focused on building modern, scalable, and user-friendly applications. I love turning complex problems into elegant digital solutions.",
    tagline: 'Creative Developer / Problem Solver',
    photoUrl: '',
    stats: [
      { label: 'Projects Built', value: '15+' },
      { label: 'Technologies', value: '10+' },
      { label: 'Semester', value: '6th' },
    ],
    highlights: [
      { icon: '🚀', text: 'Full Stack Developer' },
      { icon: '💡', text: 'Problem Solver' },
      { icon: '🎨', text: 'UI/UX Enthusiast' },
    ],
    resumeUrl: '',
  })
  console.log('📝 About seeded')

  // Projects
  await Project.insertMany([
    {
      title: 'E-Commerce Platform',
      slug: 'e-commerce-platform',
      description: 'A full-featured e-commerce platform with product management, cart, and payment integration.',
      longDesc: 'Built with React on the frontend and Node.js/Express on the backend. Features include user authentication, product CRUD, shopping cart, order management, and Stripe payment integration.',
      imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
      techStack: ['React', 'Node.js', 'MongoDB', 'Express', 'Tailwind CSS'],
      category: 'fullstack',
      liveUrl: 'https://github.com',
      githubUrl: 'https://github.com',
      visible: true,
      featured: true,
      order: 1,
    },
    {
      title: 'Task Manager App',
      slug: 'task-manager-app',
      description: 'A real-time task management app with drag-and-drop boards, labels, and team collaboration.',
      longDesc: 'Inspired by Trello. Built with React, Socket.io for real-time updates, and Firebase for auth. Features drag-and-drop with dnd-kit, color-coded labels, due dates, and member assignment.',
      imageUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80',
      techStack: ['React', 'Firebase', 'Socket.io', 'Node.js'],
      category: 'web',
      liveUrl: 'https://github.com',
      githubUrl: 'https://github.com',
      visible: true,
      featured: true,
      order: 2,
    },
    {
      title: 'Chat Application',
      slug: 'chat-application',
      description: 'Real-time chat app with private messaging, group rooms, and media sharing.',
      longDesc: 'WebSocket-based chat app with user auth, private and group chats, file/image sharing, read receipts, and online status. Uses Socket.io and MongoDB for message persistence.',
      imageUrl: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=800&q=80',
      techStack: ['React', 'Node.js', 'Socket.io', 'MongoDB'],
      category: 'fullstack',
      liveUrl: 'https://github.com',
      githubUrl: 'https://github.com',
      visible: true,
      featured: false,
      order: 3,
    },
    {
      title: 'Portfolio Website',
      slug: 'portfolio-website',
      description: 'This very portfolio — a premium dark-themed personal site with animations and an admin panel.',
      longDesc: 'Designed and built from scratch. Features Framer Motion animations, Lenis smooth scroll, custom cursor, glassmorphism cards, a full admin CRUD panel, and MongoDB backend.',
      imageUrl: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80',
      techStack: ['React', 'Framer Motion', 'Node.js', 'MongoDB', 'Tailwind CSS'],
      category: 'fullstack',
      liveUrl: 'https://github.com',
      githubUrl: 'https://github.com',
      visible: true,
      featured: true,
      order: 4,
    },
  ])
  console.log('📦 Projects seeded')

  // Skills
  await Skill.insertMany([
    { name: 'React', category: 'frontend', proficiency: 88, order: 1 },
    { name: 'JavaScript', category: 'language', proficiency: 90, order: 2 },
    { name: 'TypeScript', category: 'language', proficiency: 75, order: 3 },
    { name: 'Tailwind CSS', category: 'frontend', proficiency: 92, order: 4 },
    { name: 'Node.js', category: 'backend', proficiency: 85, order: 5 },
    { name: 'Express.js', category: 'backend', proficiency: 83, order: 6 },
    { name: 'MongoDB', category: 'database', proficiency: 82, order: 7 },
    { name: 'Firebase', category: 'database', proficiency: 78, order: 8 },
    { name: 'Git & GitHub', category: 'tools', proficiency: 87, order: 9 },
    { name: 'Framer Motion', category: 'frontend', proficiency: 80, order: 10 },
    { name: 'REST APIs', category: 'backend', proficiency: 88, order: 11 },
    { name: 'HTML & CSS', category: 'frontend', proficiency: 95, order: 12 },
  ])
  console.log('🛠️  Skills seeded')

  // Experience / Education
  await Experience.insertMany([
    {
      type: 'education',
      title: 'Bachelor of Science in Computer Science',
      organization: 'University of Gujranwala',
      location: 'Gujranwala, Pakistan',
      startDate: 'Sep 2022',
      endDate: '',
      current: true,
      description: 'Currently in Semester 6. Studying Data Structures, Algorithms, Database Systems, Software Engineering, and Web Technologies.',
      order: 1,
    },
    {
      type: 'education',
      title: 'FSc (Pre-Engineering)',
      organization: 'Govt. College, Gujranwala',
      location: 'Gujranwala, Pakistan',
      startDate: 'Sep 2020',
      endDate: 'Jul 2022',
      current: false,
      description: 'Completed pre-engineering with focus on Mathematics, Physics, and Computer Science.',
      order: 2,
    },
    {
      type: 'work',
      title: 'Freelance Web Developer',
      organization: 'Self-Employed',
      location: 'Remote',
      startDate: 'Jan 2023',
      endDate: '',
      current: true,
      description: 'Building custom web applications and landing pages for clients. Specialize in React frontends with Node.js backends.',
      order: 3,
    },
  ])
  console.log('🎓 Experience seeded')

  console.log('\n✅ Database seeded successfully!')
  console.log(`\n📋 Admin login:\n   Username: ${process.env.ADMIN_USERNAME || 'admin'}\n   Password: ${process.env.ADMIN_PASSWORD || 'sharjeel2024'}\n`)
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seed error:', err)
  process.exit(1)
})
