import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  position: { type: String, required: true },
  coverLetter: { type: String, required: true },
  resumeUrl: { type: String, required: true },
  experience: { type: Number, required: true },
  status: { type: String, default: 'Pending', enum: ['Pending', 'Reviewed', 'Rejected', 'Accepted'] },
  appliedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Application || mongoose.model('Application', ApplicationSchema);