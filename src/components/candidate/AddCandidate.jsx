import React, { useState, useEffect } from 'react';
import Form from '../utils/Form';
import { useForm ,Controller} from 'react-hook-form';
import Input from '../utils/Input';
import Label from '../utils/Label';
import TextArea from '../utils/TextArea';
import Button from '../utils/Button';
import Selected from '../utils/Select';
import Option from '../utils/Option';
import { BaseUrl } from '../utils/Endpoint';
import { City, State } from 'country-state-city';
import axios from 'axios';
import Select from 'react-select';
import { SideBar } from '../PageSections/SideBar';
// import Header from '../PageSections/Header';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import uploadIcon from '../../assets/img/upload-file.png'
const AddCandidate = () => {
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedState, setSelectedState] = useState("");
    const [isExperienced, setExperienced] = useState(false);
    const [qualifications, setQualifications] = useState([]); // Fixed typo here
    const [techArea, setTechArea] = useState([]);
    const [selectedTechAreas, setSelectedTechAreas] = useState([]);
    const [interest, setDomainofIntrest] = useState([]);
    
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitted, isSubmitting },
        trigger,
        setValue,
    } = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onSubmit'
    });

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const token = localStorage.getItem('access');
                const qualification = await axios.get(`${BaseUrl}/api/qualifications/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                const techarea = await axios.get(`${BaseUrl}/api/tech-areas/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                const domianOfInterest = await axios.get(`${BaseUrl}/api/domain-interests/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                if (qualification && techarea && domianOfInterest) {
                    setQualifications([...qualification.data]); // Fixed typo
                    setDomainofIntrest([...domianOfInterest.data]);

                    // Map the tech area data correctly
                    const fetchTechArea = techarea.data.map((tech) => ({
                        value: tech.id,
                        label: tech.tech_specification
                    }));
                    setTechArea(fetchTechArea);
                } else {
                    // Fallback if APIs aren't working
                    setTechArea([
                        { value: 'javascript', label: 'JavaScript' },
                        { value: 'react', label: 'React' },
                        { value: 'nodejs', label: 'Node.js' },
                    ]);
                }
            } catch (error) {
                console.error("API Error:", error);
                toast.error('Something went wrong, cannot fetch the records');
                // Fallback data
                setTechArea([
                    { value: 'javascript', label: 'JavaScript' },
                    { value: 'react', label: 'React' },
                    { value: 'nodejs', label: 'Node.js' },
                ]);
            }
        };
        fetchRecords();
    }, []);
    console.log(qualifications)
    useEffect(() => {
        const statesOfIndia = State.getStatesOfCountry('IN');
        setStates(statesOfIndia);
    }, []);

    useEffect(() => {
        if (selectedState) {
            const citiesOfState = City.getCitiesOfState('IN', selectedState);
            setCities(citiesOfState);
        } else {
            setCities([]);
        }
    }, [selectedState]);

    const handleFieldError = (fieldName) => {
        if (isSubmitted && errors[fieldName]) {
            return errors[fieldName].message;
        }
        return '';
    };

    const onSubmit = async (data) => {
        toast.dismiss();

        try {
            const isValid = await trigger();
            if (!isValid) {
                const firstErrorField = Object.keys(errors)[0];
                if (firstErrorField && errors[firstErrorField]) {
                    toast.error(errors[firstErrorField].message);
                }
                return;
            }

            const stateName = states.find(state => state.isoCode === data.state)?.name || "";
            const finalData = {
                ...data,
                stateName: stateName,
                cityName: data.city,
                isExperienced: isExperienced,
                tech_areas: selectedTechAreas.map(area => area.value) // Ensure we're using 'value' which holds the ID
            };

            const formData = new FormData();
            for (const key in finalData) {
                if (key === 'tech_areas') {
                    // Append each tech area ID as separate form entries
                    finalData[key].forEach(techId => {
                        formData.append(key, techId);
                    });
                } else {
                    formData.append(key, finalData[key]);
                }
            }

            if (data.resume && data.resume[0]) {
                formData.append('resume', data.resume[0]);
            }

            const token = localStorage.getItem('access');
            const response = await axios.post(`${BaseUrl}/api/add-candidate/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });

            toast.success('Candidate added successfully');
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message || 'An error occurred');
            } else {
                toast.error('An error occurred while submitting the form');
            }
        }
    };

    const handleStateChange = (e) => {
        setSelectedState(e.target.value);
    };

    const changeExperienceStatus = (e) => {
        setExperienced(e.target.checked);
    };

    const onTechAreaSelect = (selectedList) => {
        setSelectedTechAreas(selectedList);
        setValue('tech_areas', selectedList, { shouldValidate: true });
    };

    const onTechAreaRemove = (selectedList) => {
        setSelectedTechAreas(selectedList);
        setValue('tech_areas', selectedList, { shouldValidate: true });
    };

    return (
        <>

            <SideBar />
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
            <div className='candiadte-form-container'>
                <span id='candidate-container-heading'>Add New Candidate</span>
                <span id='candidate-container-sub-heading'>Enter Candidate details below</span>


                <div className='form-container'>

                    <Form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                        {/* Personal-info starts here */}
                        <br />
                        <span id="info-heading">Personal Information</span>
                        <div className='personal-info'>


                            <div>
                                <Label>Name *</Label>
                                <Input
                                    type="text"
                                    register={register('name', {
                                        required: { value: true, message: 'Name is required' },
                                        minLength: { value: 3, message: 'Name must be at least 3 characters long' },
                                        pattern: { value: /^[A-Za-z\s]+$/, message: 'Name should only contain letters and spaces' }
                                    })}
                                    placeholder={handleFieldError('name')}
                                />
                            </div>


                            <div> <Label>Date of birth *</Label>
                                <Input
                                    type="date"
                                    register={register("date_of_birth", {
                                        required: { value: true, message: "Date of birth is required" },
                                        validate: value => {
                                            const today = new Date();
                                            const birthDate = new Date(value);
                                            return birthDate < today || "Date of birth cannot be in the future";
                                        }
                                    })}
                                    placeholder={handleFieldError('date_of_birth')}
                                /></div>

                            {/*Father name*/}
                            <div>
                                <Label>Father Name</Label>
                                <Input
                                    type="text"
                                    register={register('father_name', {
                                        minLength: { value: 3, message: 'Name must be at least 3 characters long' },
                                        pattern: { value: /^[A-Za-z\s]+$/, message: 'Name should only contain letters and spaces' }
                                    })}
                                    placeholder={handleFieldError('father_name')}
                                />

                            </div>


                            {/* Mobile */}
                            <div>
                                <Label>Mobile *</Label>
                                <Input
                                    type="text"
                                    register={register('mobile', {
                                        required: { value: true, message: "Mobile number is required" },
                                        pattern: { value: /^[6-9]\d{9}$/, message: "Please enter a valid 10-digit Indian mobile number" },
                                    })}
                                    placeholder={handleFieldError('mobile')}
                                />
                            </div>
                            <div>
                                <Label>Gender *</Label>
                                <Selected
                                    register={register('gender', {
                                        required: { value: true, message: "Gender is required" },
                                        validate: value => value !== "--Select--" || "Please select a gender"
                                    })}
                                    placeholder={handleFieldError('gender')}
                                >
                                    <Option value="--Select--">--Select--</Option>
                                    <Option value="Male">Male</Option>
                                    <Option value="Female">Female</Option>
                                </Selected>
                            </div>
                            {/* Email*/}
                            <div >
                                <Label>Email *</Label>
                                <Input
                                    type="email"
                                    register={register('email', {
                                        required: { value: true, message: "Email is required" },
                                        pattern: {
                                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                            message: "Please enter a valid email address"
                                        }
                                    })}
                                    placeholder={handleFieldError('email')}
                                />
                            </div>
                        </div>
                        {/*Personal-info ends here*/}

                        <div id='address-info-heading'>  <span >Address Information</span></div>

                        {/* Address-info starts here*/}
                        <div className='address-info'>
                            <div>
                                <Label>Address *</Label>
                                <TextArea
                                    register={register('address', {
                                        required: { value: true, message: "Address is required" },
                                        minLength: { value: 10, message: "Address must be at least 10 characters long" },
                                        maxLength: { value: 200, message: "Address cannot exceed 200 characters" }
                                    })}
                                    placeholder={handleFieldError('address')}

                                />
                            </div>

                            <div className='state-city-container'>
                                <div>
                                    <Label>State</Label>
                                    <Selected
                                        register={register('state', {
                                            required: { value: true, message: "State is required" },
                                            
                                        })}
                                        onChange = {handleStateChange}
                                        placeholder={handleFieldError('state')}

                                    >
                                        <Option value="">--Select State--</Option>
                                        {states.map((state) => (
                                            <Option key={state.isoCode} value={state.isoCode}>
                                                {state.name}
                                            </Option>
                                        ))}
                                    </Selected>
                                </div>
                                <div>
                                    <Label>City</Label>
                                    <Selected
                                        register={register('city', {
                                            required: { value: true, message: "City is required" }
                                        })}
                                        placeholder={handleFieldError('city')}
                                        disabled={!selectedState}

                                    >
                                        <Option value="">--Select City--</Option>
                                        {cities.map((city, index) => (
                                            <Option key={index} value={city.name}>
                                                {city.name}
                                            </Option>
                                        ))}
                                    </Selected>
                                </div>
                            </div>
                        </div>

                        {/* address-info ends here*/}
                        {/* Professional info starts here */}
                        <div id="professional-info-heading"><span>Professional Information</span></div>
                        <div className='professional-info'>
                            <div>
                                <Label>Highest Qualification *</Label>
                                <Selected
                                    register={register('highest_Qualification', {
                                        required: { value: true, message: "Qualification is required" },
                                        validate: value => value !== "--select--" || "Please select a qualification"
                                    })}
                                    placeholder={handleFieldError('qualification')}
                                >
                                    <Option value="--select--">--select--</Option>
                                    {qualifications.map((qualification, index) => (
                                        <Option key={index} value={qualification.id}>{qualification.qualification_name}</Option>
                                    ))}
                                </Selected>
                            </div>
                            <div >
                                <Label>Domain of interest</Label>
                                <Selected
                                    register={register('domain_of_interest', {
                                        required: { value: true, message: "Domain is required" },
                                        validate: value => value !== "--select--" || "Please select a domain"
                                    })}
                                    placeholder={handleFieldError('domain_of_interest')}
                                >
                                    <Option value="--select--">--select--</Option>
                                    {interest.map((domain, index) => (
                                        <Option key={index} value={domain.id}>{domain.domain_name}</Option>
                                    ))}
                                </Selected>
                            </div>
                            <div >
                                <Label>Tech. Area *</Label>
                                <Select
                                    isMulti
                                    name="colors"
                                    options={techArea}
                                    classNamePrefix="select"
                                    onChange={(selected) => onTechAreaSelect(selected)}
                                />
                                <Input
                                    type="hidden"
                                    {...register('tech_areas', {
                                        validate: value => {
                                            return selectedTechAreas.length > 0 || "Please select at least one tech area";
                                        }
                                    })}
                                />
                                {errors.tech_areas && isSubmitted && (
                                    <div className="error-message" style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                                        {errors.tech_areas.message}
                                    </div>
                                )}
                            </div>
                            <div className="sub-professional-container">
                                <div>
                                    <Label>Qualification Description</Label>
                                    <Input
                                        type='text'
                                        register={register('qualifiaction_description')}
                                        placeholder={handleFieldError('qualifiaction_description')}
                                    />
                                </div>

                                <div >
                                    <Label>Any Career Gap</Label>
                                    <Input
                                        type="number"
                                        register={register("gap", { 
                                            min: { value: 0, message: "Gap cannot be negative" },
                                            max: { value: 50, message: "Gap seems unrealistic" }
                                        })}
                                        placeholder={handleFieldError('gap')}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* cv upload*/}
                        <div id="resume-heading"><span>Upload CV</span></div>
                        <div className='resume-container'>
                            <div className='cv-file'>
                                <img src={uploadIcon} alt="" />
                            </div>
                            <span>Drag or drop you cv here of</span>
                            <Input
                                type="file"
                                placeholder="Browse files"
                                register={register('resume', {
                                    required: 'Resume is required.',
                                })}
                            />


                        </div>

                        {/* City and Gap Fields */}

                        {/* Experienced Checkbox */}
                        <div className='experience-box'>

                            <Input
                                type="checkbox"
                                id="exp-check"
                                onChange={changeExperienceStatus}
                                checked={isExperienced}
                            />
                            <Label>Experienced</Label>
                        </div>

                        {/* Experience Fields (Conditional) */}
                        {isExperienced && (
                            <div className='experience-layout'>
                                <div>
                                    <Label>Experience Years</Label>
                                    <Input
                                        type="number"
                                        register={register("exp_years", {
                                            min: { value: 0, message: "Experience cannot be negative" },
                                            max: { value: 50, message: "Experience seems unrealistic" }
                                        })}
                                        placeholder={handleFieldError('exp_years')}
                                    />
                                </div>
                                <div >
                                    <Label>Last Company</Label>
                                    <Input
                                        type="text"
                                        register={register("last_company", {
                                            minLength: { value: 2, message: "Company name must be at least 2 characters" },
                                            pattern: { value: /^[A-Za-z0-9\s]+$/, message: "Company name should only contain letters, numbers, and spaces" }
                                        })}
                                        placeholder={handleFieldError('last_company')}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div >
                            <Button type="submit" id="submit-btn" disabled={isSubmitting}> {isSubmitting ? 'Adding...' : 'Add Candidate'}</Button>
                        </div>
                    </Form>

                </div>

            </div>
        </>
    );
};

export default AddCandidate;