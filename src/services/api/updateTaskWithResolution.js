const updateTaskWithResolution = async (taskId, status, resolutionProof, imageUrl = null) => {
  try {
    const requestPayload = {
      taskid: taskId,
      status: status
    };
    
    if (resolutionProof) {
      requestPayload.resolutionProof = resolutionProof;
    }
    
    if (imageUrl) {
      requestPayload.resolutionImageUrl = imageUrl;
    }
    
    const response = await fetch('https://streetlightfix-backend-2.onrender.com/admin/task/update', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestPayload)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update status. Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating task with resolution:', error);
    throw error;
  }
};

export default updateTaskWithResolution;