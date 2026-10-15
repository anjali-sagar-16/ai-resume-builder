
import Resume from '../models/resume.model.js'
import imagekit from '../configs/imageKit.js'
import fs from 'fs'

// Controller for creating a new resume
// POST /api/resumes/create
export const createResume = async (req, res) => {
    try {
        const userId = req.userId

        const { title } = req.body

        // Create new resume
        const newResume = await Resume.create({
            userId,
            title
        })

        // Return success data
        return res.status(201).json({
            message: 'Resume created successfully',
            resume: newResume
        })

    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}


// Controller for getting resume by ID
// GET /api/resumes/get
export const getResumeById = async (req, res) => {
    try {
        const { resumeId } = req.params
        const userId = req.userId

        // Get resume from database
        const resume = await Resume.findOne({
            userId,
            _id: resumeId
        })

        if (!resume) {
            return res.status(404).json({
                message: 'Resume not found'
            })
        }

        return res.status(200).json({
            resume
        })

    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}


// Controller for getting user resumes
// GET /api/resumes/user
export const getUserResumes = async (req, res) => {
    try {
        const userId = req.userId

        // Get all resumes of the logged-in user
        const resumes = await Resume.find({ userId })

        return res.status(200).json({
            resumes
        })

    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}


// Controller for updating a resume
// PUT /api/resumes/update
export const updateResume = async (req, res) => {
    try {
        const userId = req.userId

        const {
            resumeId,
            resumeData,
            removeBackground
        } = req.body

        const image = req.file

        let resumeDataCopy = typeof resumeData === 'string'
            ? JSON.parse(resumeData)
            : { ...resumeData }

        if (!resumeDataCopy || typeof resumeDataCopy !== 'object') {
            return res.status(400).json({ message: 'Invalid resume data' })
        }

        // Upload profile image if available
        if (image) {

            const file = fs.createReadStream(image.path)

            const response = await imagekit.files.upload({
                file,
                fileName: 'resume-profile-image.jpg',
                folder: 'user-resumes',
                transformation: {
                    pre: `w-300,h-300,fo-face,z-0.75${removeBackground === 'true' || removeBackground === 'yes' ? ',bg-remove' : ''}`
                }
            })

            resumeDataCopy.personal_info = {
                ...(resumeDataCopy.personal_info || {}),
                image: response.url
            }
        }

        const updatedResume = await Resume.findOneAndUpdate(
            {
                userId,
                _id: resumeId
            },
            {
                ...resumeDataCopy
            },
            { new: true }
        )

        if (!updatedResume) {
            return res.status(404).json({ message: 'Resume not found' })
        }

        return res.status(200).json({
            message: 'Resume updated successfully',
            resume: updatedResume
        })

    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}


// Controller for deleting a resume
// DELETE /api/resumes/delete
export const deleteResume = async (req, res) => {
    try {
        const userId = req.userId

        const { resumeId } = req.params

        // Delete resume
        const deletedResume = await Resume.findOneAndDelete({
            userId,
            _id: resumeId
        })

        if (!deletedResume) {
            return res.status(404).json({
                message: 'Resume not found'
            })
        }

        return res.status(200).json({
            message: 'Resume deleted successfully'
        })

    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

// Controller for getting public resume by ID
// GET /api/resumes/public/:resumeId
export const getPublicResumeById = async (req, res) => {
    try {
        const { resumeId } = req.params

        const resume = await Resume.findOne({
            _id: resumeId,
            public: true
        })

        if (!resume) {
            return res.status(404).json({
                message: 'Resume not found'
            })
        }

        return res.status(200).json({
            resume
        })

    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}
