import React from 'react';
import CustomDatePicker from '../../../components/CustomDatePicker';

/**
 * Component to manage all the date picker modals
 */
const DatePickerManager = ({
  globalDateState,
  issueAnalyticsDateRange,
  setIssueAnalyticsDateRange,
  responseTimeRange,
  setResponseTimeRange,
  issueTypeRange,
  setIssueTypeRange,
  technicianRange,
  setTechnicianRange,
  updateSectionDateRange
}) => {
  const {
    globalStartDate,
    setGlobalStartDate,
    globalEndDate,
    setGlobalEndDate,
    showGlobalStartPicker,
    setShowGlobalStartPicker,
    showGlobalEndPicker,
    setShowGlobalEndPicker
  } = globalDateState;

  return (
    <>
      {/* Global date pickers */}
      <CustomDatePicker
        isVisible={showGlobalStartPicker}
        onClose={() => setShowGlobalStartPicker(false)}
        onDateChange={(date) => setGlobalStartDate(date)}
        initialDate={globalStartDate}
        maximumDate={globalEndDate}
      />
      
      <CustomDatePicker
        isVisible={showGlobalEndPicker}
        onClose={() => setShowGlobalEndPicker(false)}
        onDateChange={(date) => setGlobalEndDate(date)}
        initialDate={globalEndDate}
        minimumDate={globalStartDate}
        maximumDate={new Date()}
      />
      
      {/* Section-specific date pickers */}
      <CustomDatePicker
        isVisible={issueAnalyticsDateRange.showStartPicker}
        onClose={() => {
          updateSectionDateRange('issue', {
            ...issueAnalyticsDateRange,
            showStartPicker: false
          });
        }}
        onDateChange={(date) => {
          updateSectionDateRange('issue', {
            ...issueAnalyticsDateRange,
            start: date,
            showStartPicker: false
          });
        }}
        initialDate={issueAnalyticsDateRange.start}
        maximumDate={issueAnalyticsDateRange.end}
      />
      
      <CustomDatePicker
        isVisible={issueAnalyticsDateRange.showEndPicker}
        onClose={() => {
          updateSectionDateRange('issue', {
            ...issueAnalyticsDateRange,
            showEndPicker: false
          });
        }}
        onDateChange={(date) => {
          updateSectionDateRange('issue', {
            ...issueAnalyticsDateRange,
            end: date,
            showEndPicker: false
          });
        }}
        initialDate={issueAnalyticsDateRange.end}
        minimumDate={issueAnalyticsDateRange.start}
        maximumDate={new Date()}
      />
      
      <CustomDatePicker
        isVisible={responseTimeRange.showStartPicker}
        onClose={() => {
          updateSectionDateRange('response', {
            ...responseTimeRange,
            showStartPicker: false
          });
        }}
        onDateChange={(date) => {
          updateSectionDateRange('response', {
            ...responseTimeRange,
            start: date,
            showStartPicker: false
          });
        }}
        initialDate={responseTimeRange.start}
        maximumDate={responseTimeRange.end}
      />
      
      <CustomDatePicker
        isVisible={responseTimeRange.showEndPicker}
        onClose={() => {
          updateSectionDateRange('response', {
            ...responseTimeRange,
            showEndPicker: false
          });
        }}
        onDateChange={(date) => {
          updateSectionDateRange('response', {
            ...responseTimeRange,
            end: date,
            showEndPicker: false
          });
        }}
        initialDate={responseTimeRange.end}
        minimumDate={responseTimeRange.start}
        maximumDate={new Date()}
      />
      
      <CustomDatePicker
        isVisible={issueTypeRange.showStartPicker}
        onClose={() => {
          updateSectionDateRange('issueType', {
            ...issueTypeRange,
            showStartPicker: false
          });
        }}
        onDateChange={(date) => {
          updateSectionDateRange('issueType', {
            ...issueTypeRange,
            start: date,
            showStartPicker: false
          });
        }}
        initialDate={issueTypeRange.start}
        maximumDate={issueTypeRange.end}
      />
      
      <CustomDatePicker
        isVisible={issueTypeRange.showEndPicker}
        onClose={() => {
          updateSectionDateRange('issueType', {
            ...issueTypeRange,
            showEndPicker: false
          });
        }}
        onDateChange={(date) => {
          updateSectionDateRange('issueType', {
            ...issueTypeRange,
            end: date,
            showEndPicker: false
          });
        }}
        initialDate={issueTypeRange.end}
        minimumDate={issueTypeRange.start}
        maximumDate={new Date()}
      />
      
      <CustomDatePicker
        isVisible={technicianRange.showStartPicker}
        onClose={() => {
          updateSectionDateRange('technician', {
            ...technicianRange,
            showStartPicker: false
          });
        }}
        onDateChange={(date) => {
          updateSectionDateRange('technician', {
            ...technicianRange,
            start: date,
            showStartPicker: false
          });
        }}
        initialDate={technicianRange.start}
        maximumDate={technicianRange.end}
      />
      
      <CustomDatePicker
        isVisible={technicianRange.showEndPicker}
        onClose={() => {
          updateSectionDateRange('technician', {
            ...technicianRange,
            showEndPicker: false
          });
        }}
        onDateChange={(date) => {
          updateSectionDateRange('technician', {
            ...technicianRange,
            end: date,
            showEndPicker: false
          });
        }}
        initialDate={technicianRange.end}
        minimumDate={technicianRange.start}
        maximumDate={new Date()}
      />
    </>
  );
};

export default DatePickerManager;