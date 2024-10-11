import Assignment from '../models/Assignment.js';

// Create assignment
// export const uploadAssignment = async (req, res) => {
//   const { task, adminId } = req.body;

//   try {
//     const assignment = new Assignment({ userId: req.user.userId, task, adminId });
//     await assignment.save();
//     res.json(assignment);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// };

// View assignments tagged to the admin.
export const uploadAssignment = async (req, res) => {
  const { task, adminUsername } = req.body;

  // Check if req.user is defined before accessing userId
  if (!req.user || !req.user.userId) {
    return res.status(401).json({ msg: 'User is not authenticated' });
  }

  const userId = req.user.userId; 
console.log(userId,"userId")
  try {
    // Find the admin by their username
    
    const admin = await User.findOne({ username: adminUsername, role: 'ADMIN' });
    console.log(admin,"=====================111")
    if (!admin) {
      return res.status(404).json({ msg: 'Admin not found' });
    }
    // Create a new assignment with the admin's ID
    const newAssignment = new Assignment({
      userId,
      task,
      adminId: admin._id 
    });

    // Save the assignment to the database
    await newAssignment.save();

    res.json({ msg: 'Assignment submitted successfully', assignment: newAssignment });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get assignments for admin
export const getAssignmentsForAdmin = async (req, res) => {
  try {
    const assignments = await Assignment.find({ adminId: req.user.userId });
    res.json(assignments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
// Accept an assignment
export const acceptAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment || assignment.adminId.toString() !== req.user.userId)
      return res.status(403).json({ msg: 'Not authorized' });

    assignment.status = 'ACCEPTED';
    await assignment.save();
    res.json(assignment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Reject an assignment
export const rejectAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment || assignment.adminId.toString() !== req.user.userId)
      return res.status(403).json({ msg: 'Not authorized' });

    assignment.status = 'REJECTED';
    await assignment.save();
    res.json(assignment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
