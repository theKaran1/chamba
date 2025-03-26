import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import Form from '../utils/Form';
import Label from '../utils/Label';
import Input from '../utils/Input';
import deleteIcon from '../../assets/img/delete.png'
import editIcon from '../../assets/img/editing.png'
import { SideBar } from '../PageSections/SideBar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '../utils/Button';
import { BaseUrl } from '../utils/Endpoint';
const Qualifications = () => {
    const [qualificationList, setQualificationList] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [refresh, setRefresh] = useState(false)
    // Fix the useEffect to properly handle async operation
    useEffect(() => {
        const fetchQualificationList = async () => {
            try {
                const token = localStorage.getItem('access_token')
                console.log(token, "token")
                const response = await axios.get(`${BaseUrl}/api/qualifications/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                setQualificationList(response?.data ? response?.data : []);
            } catch (error) {
                toast.error('Something went wrong, can\'t fetch list');
                console.error('Error fetching domain list:', error);
            }
        };

        fetchQualificationList();
    }, [refresh]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    // Complete the onSubmit function
    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            console.log(data);
            const token = localStorage.getItem('access');
            const response = await axios.post(`${BaseUrl}/api/qualifications/`, {
                qualification_name: data.qualification
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            // Update domain list with the new entry
            setQualificationList([...qualificationList, response.data]);

            // Show success message
            toast.success("Added Successfully")
            // Reset the form
            reset();
            setRefresh(true)
        } catch (error) {
            toast.error('Failed to add domain interest');
            console.error('Error adding domain interest:', error);
            setError('Failed to add domain interest');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Add delete functionality
    const handleDelete = async (id, index) => {
        try {
            const token = localStorage.getItem('access_token');
            await axios.delete(`${BaseUrl}/api/qualifications/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            // Remove item from the list
            const updatedList = [...qualificationList];
            updatedList.splice(index, 1);
            setDomainList(updatedList);

            toast.success('Domain interest deleted successfully');
        } catch (error) {
            toast.error('Failed to delete domain interest');
            console.error('Error deleting domain interest:', error);
        }
    };

    console.log(qualificationList, "domainList");

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
            <div className="domain-container">
    {/* Domain Header */}
    <div className="domain-header">
        <div className="domain-title">
            <span>Qualification Management</span>
        </div>
        {/* <div id="add-button">
            <Button>+ Add New Domain</Button>
        </div> */}
    </div>

    {/* Form and List Container */}
    <div className="domain-form-layout">
        {/* Form Container */}
        <div className="domain-form-container">
            <div className="domain-form">
                <div className="domain-heading">
                    <span>Add Qualifications</span>
                </div>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Label className="domain-label">Qualifications</Label>
                    <Input
                        type="text"
                        register={register('qualification_name', {
                            required: { value: true, message: 'This field is required' },
                        })}
                        error={errors.qualification_name}
                        placeholder={errors.qualifications_name?.message || ''}
                    /> <br />           
                    <Button type="submit" disabled={isSubmitting} id="submit-btn2">
                        {isSubmitting ? 'Adding...' : 'Add'}
                    </Button>
                </Form>
            </div>
        </div>

        {/* List Container */}
        <div className="domain-list-container">
            <div className="domain-list-label">
                <span>Existing qualification's</span>
            </div>
            <div className="domain-list-items">
            {qualificationList.length > 0 ? (
                qualificationList.slice(0,3).map((qualifications, index) => (
                    <div key={index} className="domain-item">
                        <span>{qualifications.qualification_name || 'Loading...'}</span><div id='border'></div>
                        <div>
                        <Button id = "edit-btn"><img src={editIcon} alt="" /></Button>
                        <Button id="submit-btn3" onClick={() => handleDelete(qualifications.id,index)}>
                            <img src={deleteIcon} alt="" />
                        </Button>
                        </div>
                       
                    </div>
                ))
            ) : (
                <div id="warning">No qualification found</div>
            )}
            </div>
        </div>
    </div>
    <div className="domain-stats">
        <span>Qualifications</span>
        <div className="total-domains">
            Total qualification
            <span>{qualificationList.length}</span>

        </div>
    </div>
</div>
        </>
    );
};

export default Qualifications;