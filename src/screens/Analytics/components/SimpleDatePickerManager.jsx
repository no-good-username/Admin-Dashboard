import React from 'react';
import CustomDatePicker from '../../../components/CustomDatePicker';

const SimpleDatePickerManager = ({
  globalStartDate,
  globalEndDate,
  showGlobalStartPicker,
  showGlobalEndPicker,
  setShowGlobalStartPicker,
  setShowGlobalEndPicker,
  updateGlobalDateRange
}) => {
  return (
    <>
      {/* Global Start Date Picker */}
      <CustomDatePicker
        isVisible={showGlobalStartPicker}
        onClose={() => setShowGlobalStartPicker(false)}
        onDateChange={(date) => {
          setShowGlobalStartPicker(false);
          updateGlobalDateRange(date, null);
        }}
        initialDate={globalStartDate}
        maximumDate={globalEndDate}
      />
      
      {/* Global End Date Picker */}
      <CustomDatePicker
        isVisible={showGlobalEndPicker}
        onClose={() => setShowGlobalEndPicker(false)}
        onDateChange={(date) => {
          setShowGlobalEndPicker(false);
          updateGlobalDateRange(null, date);
        }}
        initialDate={globalEndDate}
        minimumDate={globalStartDate}
        maximumDate={new Date()}
      />
    </>
  );
};

export default SimpleDatePickerManager;