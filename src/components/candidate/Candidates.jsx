import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { SideBar } from '../PageSections/SideBar';
import Button from '../utils/Button';
import exportIcon from '../../assets/img/export.png';
import Input from '../utils/Input';
import Form from '../utils/Form';
import importIcon from '../../assets/img/import.png';
import Option from '../utils/Option';
import { Controller, useForm } from 'react-hook-form';
import Selected from '../utils/Select';
import { BaseUrl } from '../utils/Endpoint';
import { ToastContainer, toast } from 'react-toastify';
import previewIcon from '../../assets/img/previewEye.png';
import addIcon from '../../assets/img/add.png';
import searchIcon from '../../assets/img/search.png';
import deleteIcon from '../../assets/img/delete.png';
import callIcon from '../../assets/img/call.png';
import { Link } from 'react-router';
import downloadIcon from '../../assets/img/download.png';
import videoIcon from '../../assets/img/video.png';
import inPersonIcon from '../../assets/img/office.png';
import Imag from '../utils/Imag';
import backIcon from '../../assets/img/previous.png';
import editIcon from '../../assets/img/editing.png';
import personDetailsIcon from '../../assets/img/action-menu-personal.png';
import attachmentIcon from '../../assets/img/action-menu-attachment.png';
import resumeIcon from '../../assets/img/resume.png';
import Label from '../utils/Label';
import Pagination from '../utils/Pagination';
import calenderIcon from '../../assets/img/calender.png';
import cancelIcon from '../../assets/img/cross.png';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';

const Candidates = () => {
  const [qualifications, setQualifications] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [qualificationResults, setQualificationResults] = useState([]);
  const [totalRecords, setTotalRecords] = useState();
  const [candidateList, setCandidateList] = useState([
    {
      id: 1,
      name: "karan singh",
      date_of_birth: "06-08-2005",
      qualification: "diploma in cs",
      email: "karan@yopmail.com",
      mobile: "7018422097",
      imgName: "karans singh's-resume.pdf",
    },
    {
      id: 2,
      name: "karan singh",
      date_of_birth: "06-08-2005",
      qualification: "diploma in cs",
      email: "karan@yopmail.com",
      mobile: "7018422097",
      imgName: "karans singh's-resume.pdf",
    },
  ]);
  const [activeFilter, setActiveFilter] = useState('none');
  const [isPreviewVisible, setPreview] = useState(false);
  const [candidateToPreview, setCandidateToPreview] = useState(null);
  const [activePreviewFilter, setActivePreviewFilter] = useState('personal');
  const [relativeDateFilter, setRelativeDateFilter] = useState();
  const [relativeDateFilterData, setRelativeDateFilterData] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  const interviewersNames = [
    { value: 'Ankit Arora', label: 'Ankit Arora' },
    { value: 'HR', label: 'HR' },
  ];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const {
    control,
    register: registerInterview,
    handleSubmit: handleSubmitInterview,
    setValue: setInterviewValue,
    watch: watchInterview,
    formState: { errors: interviewErrors },
  } = useForm({
    defaultValues: {
      status: 'Scheduled',
      interviewers: [],
      candidate_id: '',
      stage: '',
      interview_date: '',
      interview_time: '',
      interview_mode: '', // Initialize interview_mode
    },
  });

  const watchSearchQuery = watch("searchQuery", "");
  const watchQualification = watch("qualificationFilter", "");
  const selectedInterviewMode = watchInterview('interview_mode'); // Watch the interview_mode field

  const handleInterviewSechdulingSubmition = async (data) => {
    try {
      const token = localStorage.getItem('access');
      const response = await axios.post(`${BaseUrl}api/interviews/`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Successfully scheduled the interview");
      console.log('Submitted Data:', data); // Log the submitted data for debugging
    } catch (error) {
      toast.error(error.response?.data.message || 'Something went wrong');
      console.error('Submission Error:', error.response?.data); // Log errors for debugging
    }
  };

  useEffect(() => {
    const fetchQualifications = async () => {
      try {
        const token = localStorage.getItem('access');
        const response = await axios.get(`${BaseUrl}api/qualifications/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data) setQualifications(response.data);
      } catch (error) {
        console.log(error.response?.data.message || 'An error occurred');
      }
    };
    fetchQualifications();
  }, []);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const token = localStorage.getItem('access');
        const response = await axios.get(`${BaseUrl}api/add-candidate/`, {
          params: { page: currentPage, page_size: itemsPerPage },
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;
        setCandidateList(response.data.results || []);
        setTotalRecords(data.total_records);
        setTotalPages(response.data.total_pages || 1);
        setCurrentPage(response.data.current_page || 1);
      } catch (error) {
        toast.error(error.response?.data.message || 'Failed to fetch candidates');
      }
    };
    if (activeFilter === 'none') fetchCandidates();
  }, [currentPage, itemsPerPage, activeFilter]);

  const handleSearch = async (data, page = 1) => {
    if (!data.searchQuery || data.searchQuery.length < 3) {
      setActiveFilter('none');
      return;
    }
    try {
      const token = localStorage.getItem('access');
      const response = await axios.get(`${BaseUrl}api/candidates/search/`, {
        params: { q: data.searchQuery, page, page_size: itemsPerPage },
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setSearchResults(response.data.results || []);
        setTotalPages(response.data.total_pages || 1);
        setCurrentPage(response.data.current_page || page);
        setActiveFilter('search');
      }
    } catch (error) {
      toast.error(error.response?.data.message || 'Search failed');
      setActiveFilter('none');
    }
  };

  const handleQualificationFilter = async (qualificationId, page = 1) => {
    if (!qualificationId) {
      setActiveFilter('none');
      return;
    }
    try {
      const token = localStorage.getItem('access');
      const response = await axios.get(`${BaseUrl}api/qualifications/search/`, {
        params: { qualification_id: qualificationId, page, page_size: itemsPerPage },
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setQualificationResults(response.data.candidates || []);
        setTotalPages(response.data.total_pages || 1);
        setCurrentPage(response.data.current_page || page);
        setActiveFilter('qualification');
      }
    } catch (error) {
      toast.error(error.response?.data.message || 'Qualification filter failed');
      setActiveFilter('none');
    }
  };

  const handleRelativeDateData = async (page = 1) => {
    if (!relativeDateFilter) {
      setActiveFilter('none');
      return;
    }
    try {
      const token = localStorage.getItem('access');
      const response = await axios.get(`${BaseUrl}api/candidates/relative-date-filter/`, {
        params: { filter: relativeDateFilter, page, page_size: itemsPerPage },
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setRelativeDateFilterData(response.data.data || []);
        setTotalPages(response.data.total_pages || 1);
        setCurrentPage(response.data.current_page || page);
        setActiveFilter('relativeDateFilter');
      }
    } catch (error) {
      toast.error(error.response?.data.message || 'Date filter failed');
    }
  };
  console.log(relativeDateFilterData);

  const handleQualificationChange = (e) => {
    const qualificationId = e.target.value;
    if (qualificationId) {
      handleQualificationFilter(qualificationId, 1);
    } else {
      setActiveFilter('none');
    }
  };

  useEffect(() => {
    if (relativeDateFilter) {
      handleRelativeDateData(1);
    } else {
      setActiveFilter('none');
    }
  }, [relativeDateFilter]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      switch (activeFilter) {
        case 'search':
          handleSearch({ searchQuery: watchSearchQuery }, newPage);
          break;
        case 'qualification':
          handleQualificationFilter(watchQualification, newPage);
          break;
        case 'relativeDateFilter':
          handleRelativeDateData(newPage);
          break;
        default:
          break;
      }
    }
  };

  const resetFilters = () => {
    setActiveFilter('none');
    reset({ searchQuery: "", qualificationFilter: "" });
    setRelativeDateFilter(null);
    setCurrentPage(1);
  };

  const handleDelete = async (candidateId) => {
    try {
      const token = localStorage.getItem('access');
      await axios.delete(`${BaseUrl}api/candidates-delete-update/${candidateId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Candidate deleted successfully');
      setCandidateList(candidateList.filter(candidate => candidate.id !== candidateId));
      if (activeFilter === 'search') {
        setSearchResults(searchResults.filter(candidate => candidate.id !== candidateId));
      } else if (activeFilter === 'qualification') {
        setQualificationResults(qualificationResults.filter(candidate => candidate.id !== candidateId));
      } else if (activeFilter === 'relativeDateFilter') {
        setRelativeDateFilterData(relativeDateFilterData.filter(candidate => candidate.id !== candidateId));
      }
    } catch (error) {
      toast.error('Failed to delete candidate');
    }
  };

  const handleOpenPreview = (candidate) => {
    setCandidateToPreview(candidate);
    setPreview(true);
    document.body.classList.add('modal-open');
  };

  const handleClosePreview = () => {
    setPreview(false);
    setCandidateToPreview(null);
    document.body.classList.remove('modal-open');
  };

  const getDisplayData = () => {
    switch (activeFilter) {
      case 'search':
        return searchResults;
      case 'qualification':
        return qualificationResults;
      case 'relativeDateFilter':
        return relativeDateFilterData;
      default:
        return candidateList;
    }
  };

  const displayData = getDisplayData();

  const personalDetailsHandler = () => setActivePreviewFilter('personal');
  const attachmentDetailsHandler = () => setActivePreviewFilter('attachments');
  const scheduleInterviewHandler = () => setActivePreviewFilter('scheduleInterview');

  const renderPreviewSection = () => {
    switch (activePreviewFilter) {
      case 'attachments':
        return (
          <div className='attachment-contianer'>
            <div className="attachment-card">
              <div id='resume-card'>
                <Imag src={resumeIcon} />
                <span>{candidateToPreview.resume || "resume.file"}</span>
              </div>
              <div>
                <a
                  href={`${BaseUrl}api${candidateToPreview.resume}`}
                  download
                  style={{ marginLeft: '10px', textDecoration: 'underline', color: 'blue' }}
                ><Imag src={downloadIcon} /></a>
              </div>
            </div>
          </div>
        );
      case 'scheduleInterview':
        return (
          <div className='interview-main'>
            <div className="interview-container">
              <div className="schedule-interview-header">
                <h3>Schedule Interview</h3>
                <span>Please fill in the interview details below</span>
              </div>
              <Form onSubmit={handleSubmitInterview(handleInterviewSechdulingSubmition)}>
                <Input type='hidden' value="Scheduled" register={registerInterview('status')} />
                <div className="interview-form-container">
                  <div id="box1">
                    <Label>Interviewer Name*</Label>
                    <Controller
                      name='interviewers'
                      control={control}
                      rules={{ required: 'Please select at least one interviewer' }}
                      render={({ field }) => (
                        <CreatableSelect
                          isMulti
                          options={interviewersNames}
                          value={field.value}
                          onChange={(selectedOptions) => field.onChange(selectedOptions)}
                          onCreateOption={(inputValue) => {
                            const newOption = { value: inputValue.toLowerCase(), label: inputValue };
                            const updatedOptions = [...(field.value || []), newOption];
                            field.onChange(updatedOptions);
                          }}
                          formatCreateLabel={(inputValue) => `Create "${inputValue}"`}
                          placeholder='Select interviewers...'
                        />
                      )}
                    />
                    {interviewErrors.interviewers && (
                      <p style={{ color: 'red' }}>{interviewErrors.interviewers.message}</p>
                    )}
                  </div>
                  <Input type="hidden" value={candidateToPreview.id} register={registerInterview('candidate_id')} />
                  <div id='box2'>
                    <Label>Interview Stage*</Label>
                    <Selected register={registerInterview('stage', { required: 'Select the round' })}>
                      <Option value="">--Select Stage--</Option>
                      <Option value="Screening">Screening Round</Option>
                      <Option value='Technical_Round1'>Technical Round 1</Option>
                      <Option value="Technical_Round2">Technical Round 2</Option>
                      <Option value="HR">HR Round</Option>
                    </Selected>
                    {interviewErrors.stage && (
                      <p style={{ color: 'red' }}>{interviewErrors.stage.message}</p>
                    )}
                  </div> 
                  <div id='box3'>
                    <Label>Date*</Label>
                    <Input
                      type="date"
                      register={registerInterview('interview_date', { required: 'Date is required' })}
                    />
                    {interviewErrors.interview_date && (
                      <p style={{ color: 'red' }}>{interviewErrors.interview_date.message}</p>
                    )}
                  </div>
                  <div id='box4'>
                    <Label>Time*</Label>
                    <Input
                      type="time"
                      register={registerInterview('interview_time', { required: 'Time is required' })}
                    />
                    {interviewErrors.interview_time && (
                      <p style={{ color: 'red' }}>{interviewErrors.interview_time.message}</p>
                    )}
                  </div>
                  <Label>Interview Mode*</Label>
                </div>
                {/* Hidden input to register interview_mode with the form */}
                <Input
                  type="hidden"
                  register={registerInterview('interview_mode', { required: 'Interview mode is required' })}
                />
                <div className="interview-mode-container">
                  <Button
                    type="button"
                    onClick={() => setInterviewValue('interview_mode', 'video_call', { shouldValidate: true })}
                    style={selectedInterviewMode === 'video_call' ? { backgroundColor: 'black', color: 'white' } : {}}
                  >
                    <Imag src={videoIcon} />
                    <span>Video Call</span>
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setInterviewValue('interview_mode', 'in_person', { shouldValidate: true })}
                    style={selectedInterviewMode === 'in_person' ? { backgroundColor: 'black', color: 'white' } : {}}
                  >
                    <Imag src={inPersonIcon} />
                    <span>In Person</span>
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setInterviewValue('interview_mode', 'call', { shouldValidate: true })}
                    style={selectedInterviewMode === 'call' ? { backgroundColor: 'black', color: 'white' } : {}}
                  >
                    <Imag src={callIcon} />
                    <span>Phone Call</span>
                  </Button>
                </div>
                {interviewErrors.interview_mode && (
                  <p style={{ color: 'red' }}>{interviewErrors.interview_mode.message}</p>
                )}
                <div className="interview-container-buttons">
                  {/* <Button id="cancel-btn" onClick={handleClosePreview}><Imag src={cancelIcon}/>Cancel</Button> */}
                  <Button type="submit" id="interview-schedule-btn"><Imag src={calenderIcon}/>Schedule Interview</Button>
                </div>
              </Form>
            </div>
          </div>
        );
      default:
        return (
          <>
            <h3 id='preview-title'>Personal Details</h3>
            <div className="preview-content">
              <div className="preview-content-section1">
                <Label>Name</Label><span>{candidateToPreview.name}</span>
                <Label>Email</Label><span>{candidateToPreview.email}</span>
                <Label>Mobile</Label><span>{candidateToPreview.mobile}</span>
              </div>
              <div className="preview-content-section2">
                <Label>Date of birth</Label><span>{candidateToPreview.date_of_birth}</span>
                <Label>Skills</Label>
                <div className='preview-skills'>
                  {
                    candidateToPreview.tech_areas.map((skill, index) => (
                      <span key={index}>{skill.tech_specification}</span>
                    ))
                  }
                </div>
              </div>
            </div>
            <div className="qualification-container">
              <h3>Qualification</h3>
              <span>{candidateToPreview.highest_Qualification_detail?.qualification_name || candidateToPreview.qualification}</span>
              <p>{candidateToPreview.highest_Qualification_detail?.qualification_desc}</p>
            </div>
          </>
        );
    }
  };

  const handleActiveButton = (button) => {
    return activePreviewFilter === button ? { backgroundColor: '#ddd', color: 'black', borderRadius: '5px' } : {};
  };

  const handleDownloadResume = async (candidate) => {
    try {
      const token = localStorage.getItem('access');
      const response = await axios({
        url: `${BaseUrl}api/candidate/${candidate.id}/resume/`,
        method: 'GET',
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` },
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', candidate.resume || `${candidate.name.replace(/\s+/g, '-')}-resume.pdf`);
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
      toast.success('Resume downloaded successfully');
    } catch (error) {
      toast.error(error.response?.data.message || 'Failed to download resume');
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <SideBar />
      <div className="candidate-container">
        <div className="candidate-sub-container">
          <div className="candidate-header">
            <span>Candidate List</span>
            <Button id="add-btn"><Link to="/add-candidate"><img src={addIcon} alt="" />Add New</Link></Button>
            <Button id="import-btn"><img src={importIcon} alt="" />Import</Button>
            <Button id="export-btn"><img src={exportIcon} alt="" />Export/</Button>
          </div>
          <div className="candidate-stats">
            <div className="candidate-stat-cards">
              <span id='candidate-stat-heading'>Total candidates</span>
              <span id="candidate-stat-value">{totalRecords}</span>
            </div>
            <div className="candidate-stat-cards">
              <span id='candidate-stat-heading'>Added this week</span>
              <span id="candidate-stat-value" className='blue'>0</span>
            </div>
            <div className="candidate-stat-cards">
              <span id='candidate-stat-heading'>Shortlisted Candidates</span>
              <span id="candidate-stat-value" className='green'>0</span>
            </div>
            <div className="candidate-stat-cards">
              <span id='candidate-stat-heading'>Rejected Candidates</span>
              <span id="candidate-stat-value" className='red'>0</span>
            </div>
          </div>
          <div className="candidate-actions">
            <div className="search-candidate">
              <Form onSubmit={handleSubmit((data) => handleSearch(data, 1))}>
                <span className='search-input'>
                  <img src={searchIcon} id='search-icon' alt="Search" />
                  <Input
                    type="text"
                    register={register("searchQuery")}
                    error={errors.searchQuery?.message}
                    placeholder={errors.searchQuery ? errors.searchQuery.message : "Search..."}
                  />
                </span>
                <Selected
                  id="qualificationFilter"
                  value={watchQualification}
                  onChange={handleQualificationChange}
                >
                  <Option value="">--select qualification--</Option>
                  {qualifications.length > 0 ? qualifications.map((qualification) => (
                    <Option key={qualification.id} value={qualification.id}>
                      {qualification.qualification_name}
                    </Option>
                  )) : <Option value="">No qualifications available</Option>}
                </Selected>
              </Form>
            </div>
            <div className="date-filter">
              <Selected value={relativeDateFilter} onChange={(e) => setRelativeDateFilter(e.target.value)}>
                <Option>Select</Option>
                <Option value="today">Today</Option>
                <Option value="last_week">Last week</Option>
                <Option value="this_month">This month</Option>
              </Selected>
            </div>
          </div>
          {activeFilter !== 'none' && (
            <div className="filter-indicator">
              Showing results for: {activeFilter === 'search' ? `"${watchSearchQuery}"` : activeFilter === 'qualification' ? 'Selected qualification' : 'Date filter'}
              <Button onClick={resetFilters}>Reset filter</Button>
            </div>
          )}
          <div className="candidate-list-container">
            <table className="candidate-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Name/Email/Mobile</th>
                  <th>Date of Birth</th>
                  <th>Qualification</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayData.length > 0 ? displayData.map((candidate) => (
                  <tr key={candidate.id} className='candidate-item'>
                    <td>
                      <Input type="checkbox"/>
                    </td>
                    <td>
                      <span className="candidate-name">{candidate.name}</span><br />
                      <span className="candidate-email">{candidate.email}</span><br />
                      <span className="candidate-mobile">{candidate.mobile}</span>
                    </td>
                    <td>{candidate.date_of_birth}</td>
                    <td>{candidate.highest_Qualification_detail?.qualification_name || candidate.qualification || "N/A"}</td>
                    <td>{candidate.status}</td>
                    <td>
                      <div className="action-buttons">
                        <Button id="preview-btn" onClick={() => handleOpenPreview(candidate)}>
                          <img src={previewIcon} alt="Preview" />
                        </Button>
                        <Button id="editing-btn">
                          <img src={editIcon} alt="Preview" />
                        </Button>
                        <Button id="delete-btn" onClick={() => handleDelete(candidate.id)}>
                          <img src={deleteIcon} alt="Delete" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="4" className="no-data">No candidates found</td></tr>
                )}
              </tbody>
            </table>
            <div className="paginaiton-container">
              <Pagination className="candidate-pagination"
                currentPage={currentPage}
                totalPages={totalPages}
                OnPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
      {isPreviewVisible && candidateToPreview && (
        <div className="preview-modal-container">
          <div className="preview-modal">
            <div className="preview-modal-header">
              <Button onClick={handleClosePreview} id="preview-modal-back-button"><img src={backIcon} alt="" /></Button>
              <h2>Candidate Details</h2>
            </div>
            <div className="preview-section-action-menu">
              <Button onClick={personalDetailsHandler} style={handleActiveButton('personal')}><img src={personDetailsIcon} alt="" /><span>Personal Details</span></Button>
              <Button onClick={attachmentDetailsHandler} style={handleActiveButton('attachments')}><img src={attachmentIcon} alt="" /><span>Attachments</span></Button>
              <Button onClick={scheduleInterviewHandler} style={handleActiveButton('scheduleInterview')}><img src={attachmentIcon} alt="" /><span>Schedule Interview</span></Button>
            </div>
            {renderPreviewSection()}
          </div>
        </div>
      )}
    </>
  );
};

export default Candidates;