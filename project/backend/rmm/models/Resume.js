import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  basics: {
    name: { type: String, default: "" },
    headline: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    dob: { type: String, default: "" },
    location: {
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      country: { type: String, default: "" }
    },
    website: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    github: { type: String, default: "" },
    portfolio: { type: String, default: "" },
    photo: { type: String, default: "" },
    summary: { type: String, default: "" }
  },

  education: [
    {
      institution: { type: String, default: "" },
      degree: { type: String, default: "" },
      fieldOfStudy: { type: String, default: "" },
      type: { type: String, default: "" },
      startDate: { type: String, default: "" },
      endDate: { type: String, default: "" },
      ongoing: { type: Boolean, default: false },
      grade: { type: String, default: "" },
      activities: { type: String, default: "" },
      description: { type: String, default: "" }
    }
  ],

  experience: [
    {
      company: { type: String, default: "" },
      position: { type: String, default: "" },
      location: { type: String, default: "" },
      industry: { type: String, default: "" },
      employmentType: { type: String, default: "" },
      startDate: { type: String, default: "" },
      endDate: { type: String, default: "" },
      ongoing: { type: Boolean, default: false },
      summary: { type: String, default: "" },
      skillsUsed: { type: [String], default: [] },
      highlights: { type: [String], default: [] }
    }
  ],

  projects: [
    {
      name: { type: String, default: "" },
      description: { type: String, default: "" },
      techStack: { type: [String], default: [] },
      startDate: { type: String, default: "" },
      endDate: { type: String, default: "" },
      duration: { type: String, default: "" },
      status: { type: String, default: "" },
      collaborators: { type: [String], default: [] },
      teamSize: { type: Number, default: null },
      url: { type: String, default: "" },
      github: { type: String, default: "" },
      role: { type: String, default: "" },
      impact: { type: String, default: "" }
    }
  ],

  skills: {
    technical: [
      {
        name: { type: String, default: "" },
        proficiencyLevel: { type: String, default: "" }
      }
    ],
    tools: { type: [String], default: [] },
    soft: { type: [String], default: [] },
    spokenLanguages: [
      {
        language: { type: String, default: "" },
        proficiency: { type: String, default: "" }
      }
    ]
  },

  certifications: [
    {
      title: { type: String, default: "" },
      issuer: { type: String, default: "" },
      date: { type: String, default: "" },
      expiryDate: { type: String, default: "" },
      url: { type: String, default: "" }
    }
  ],

  achievements: [
    {
      title: { type: String, default: "" },
      type: { type: String, default: "" },
      date: { type: String, default: "" },
      description: { type: String, default: "" }
    }
  ],

  volunteering: [
    {
      organization: { type: String, default: "" },
      role: { type: String, default: "" },
      cause: { type: String, default: "" },
      startDate: { type: String, default: "" },
      endDate: { type: String, default: "" },
      description: { type: String, default: "" }
    }
  ],

  extraCurricular: [
    {
      activity: { type: String, default: "" },
      position: { type: String, default: "" },
      description: { type: String, default: "" },
      date: { type: String, default: "" }
    }
  ],

  publications: [
    {
      title: { type: String, default: "" },
      publisher: { type: String, default: "" },
      date: { type: String, default: "" },
      url: { type: String, default: "" },
      description: { type: String, default: "" }
    }
  ],

  patents: [
    {
      title: { type: String, default: "" },
      number: { type: String, default: "" },
      date: { type: String, default: "" },
      description: { type: String, default: "" },
      url: { type: String, default: "" }
    }
  ],

  references: [
    {
      name: { type: String, default: "" },
      position: { type: String, default: "" },
      company: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      relationship: { type: String, default: "" }
    }
  ],

  customSections: [
    {
      title: { type: String, default: "" },
      type: { type: String, default: "" },
      entries: [
        {
          label: { type: String, default: "" },
          value: { type: String, default: "" }
        }
      ]
    }
  ],

  meta: {
    workAuthorization: { type: String, default: "" },
    availability: { type: String, default: "" },
    expectedSalary: { type: String, default: "" },
    hobbies: { type: [String], default: [] },
    interests: { type: [String], default: [] }
  }
});
const Resume = mongoose.models.Resume || mongoose.model('Resume', resumeSchema);

export default Resume;