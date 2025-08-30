import mongoose from 'mongoose';

const Resume = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
    
    basics: {
      name: "",
      headline: "", 
      email: "",
      phone: "",
      dob: "", 
      location: {
        city: "",
        state: "",
        country: ""
      },
      website: "",
      linkedin: "",
      github: "",
      portfolio: "",
      photo: "", 
      summary: ""
    },
  
    education: [
      {
        institution: "",
        degree: "",
        fieldOfStudy: "",
        type: "", 
        startDate: "",
        endDate: "",
        ongoing: false,
        grade: "",
        activities: "",
        description: ""
      }
    ],
  
    experience: [
      {
        company: "",
        position: "",
        location: "",
        industry: "",
        employmentType: "",
        startDate: "",
        endDate: "",
        ongoing: false,
        summary: "",
        skillsUsed: [],
        highlights: []
      }
    ],
  
    projects: [
      {
        name: "",
        description: "",
        techStack: [],
        startDate: "",
        endDate: "",
        duration: "", 
        status: "", 
        collaborators: [],
        teamSize: null,
        url: "",
        github: "",
        role: "",
        impact: ""
      }
    ],
  
    skills: {
      technical: [
        {
          name: "",
          proficiencyLevel: "" 
        }
      ],
      tools: [],
      soft: [],
      spokenLanguages: [
        {
          language: "",
          proficiency: "" 
        }
      ]
    },
  
    certifications: [
      {
        title: "",
        issuer: "",
        date: "",
        expiryDate: "",
        url: ""
      }
    ],
  
    achievements: [
      {
        title: "",
        type: "", 
        date: "",
        description: ""
      }
    ],
  
    volunteering: [
      {
        organization: "",
        role: "",
        cause: "", 
        startDate: "",
        endDate: "",
        description: ""
      }
    ],
  
    extraCurricular: [
      {
        activity: "",
        position: "",
        description: "",
        date: ""
      }
    ],
  
    publications: [
      {
        title: "",
        publisher: "",
        date: "",
        url: "",
        description: ""
      }
    ],
  
    patents: [
      {
        title: "",
        number: "",
        date: "",
        description: "",
        url: ""
      }
    ],
  
    references: [
      {
        name: "",
        position: "",
        company: "",
        email: "",
        phone: "",
        relationship: ""
      }
    ],
  
    customSections: [
      {
        title: "",
        type: "", 
        entries: [
          {
            label: "",
            value: ""
          }
        ]
      }
    ],
  
    meta: {
      workAuthorization: "", 
      availability: "", 
      expectedSalary: "",
      hobbies: [],
      interests: []
    }
});
  
  export default Resume;