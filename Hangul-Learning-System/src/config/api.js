export const API_URL = 'https://localhost:7201/';

export const endpoints = {
    account: {
        login: 'api/Authentication/login',
        register: 'api/Authentication/register',
        verifyOTP: 'api/Authentication/verify-otp',
        sendOTP: 'api/Email/send'
    },
    manageAccount: {
        getAccount: 'api/Account/list-account-with-role-gender-status',

        // create Account for Lecturer
        createAccount: 'api/Account/create-account',
    },
    manageClass: {
        create: 'api/Class/create',
        getAll: 'api/Class/get-all-paginated',
        getById: 'api/Class/get-by-id',
        getbySubject: '/api/Class/get-by-subject',
        update: 'api/Class/update',
        getByTeacher: 'api/Class/get-by-teacher',
        getByStudent: 'api/Class/get-by-subject-teacher',
        getByStatus: 'api/Class/get-by-status',
        delete: 'api/Class/delete/',
        count: 'api/Subject/count'
    },
    manageBlog: {
        
    },
    manageSchedule: {
        
    },
    manageSubject:{
        create: 'api/Subject/create',
        getAll: 'api/Subject/get-all',
        getSubject: '/api/Subject/get-by-status', 
        update: 'api/Subject/update',
        updateStatus: 'api/Subject/update-status',
        getById: 'api/Subject/get-subject-by-',
        delete: 'api/Subject/delete/',
        count: 'api/Subject/count'
    },
    syllabus: {
        // Assessment Criteria
        getAssessmentCriteria: 'api/AssessmentCriteria/get-by-subject',
        createAssessmentCriteria: 'api/AssessmentCriteria/create',
        updateAssessmentCriteria: 'api/AssessmentCriteria/update',
        deleteAssessmentCriteria: 'api/AssessmentCriteria/delete',

        // // Syllabus Info
        // getSyllabusInfo: 'api/Syllabus/get-syllabus-by-subject-id',
        // create: 'api/Syllabus/create-syllabus',
        // update: 'api/Syllabus/update-syllabus',
        // delete: 'api/Syllabus/delete-syllabus',
        
        // Syllabus Schedule
        getSyllabusSchedule: 'api/SyllabusSchedule/get-schedule-by-subject',
        addSchedule: 'api/Syllabus/add-schedule',
        updateSchedule: 'api/SyllabusSchedule/bulk-update',
        deleteSchedule: 'api/Syllabus/delete-schedule',


        // Schedule Test
        getScheduleTest: 'api/SyllabusSchedule/get-schedule-by-subject',
        // createScheduleTest: 'api/SyllabusSchedule/schedules',

        // NEW: Create Syllabus Schedule
        createSyllabusSchedule: 'api/SyllabusSchedule/create-syllabus-schedule',
    },
    class: {
        // Class
        checkName: 'api/Class/check-name',
        
    },
    cloudinary: {
        uploadAvatar: 'api/Cloudinary/upload-image-avatar',
        uploadClassImage: 'api/Cloudinary/upload-image-class',
        uploadTestSectionImage: 'api/Cloudinary/upload-image-test-section',
        uploadQuestionImage: 'api/Cloudinary/upload-image-question',
        uploadMCQOptionImage: 'api/Cloudinary/upload-image-mcq-option',
        uploadTestSectionAudio: 'api/Cloudinary/upload-audio-test-section', 
        uploadQuestionAudio: 'api/Cloudinary/upload-audio-question',
        uploadMCQOptionAudio: 'api/Cloudinary/upload-audio-mcq-option',
    },
    systemConfig: {
        getConfigByKey: 'api/SystemConfig/get-config-by-key/',
    },
   
    payment: {
    create: 'api/Payment/create',
    getQr: (paymentId) => `api/Payment/qr/${paymentId}`,
    getStatus: (paymentId) => `api/Payment/status/${paymentId}`
  }
};