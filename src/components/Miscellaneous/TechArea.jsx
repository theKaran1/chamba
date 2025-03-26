import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import Form from '../utils/Form';
import Label from '../utils/Label';
import Input from '../utils/Input';
import deleteIcon from '../../assets/img/delete.png';
import editIcon from '../../assets/img/editing.png';
import { SideBar } from '../PageSections/SideBar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '../utils/Button';

const TechArea = () => {
    const [techAreaList, setTechAreaList] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        const fetchTechAreaList = async () => {
            try {
                const token = localStorage.getItem('access_token');
                console.log(token, "token");
                const response = await axios.get('http://192.168.137.161:8000/hr/qualifications/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setTechAreaList(response?.data ? response?.data : []);
            } catch (error) {
                toast.error('Something went wrong, can\'t fetch list');
                console.error('Error fetching tech area list:', error);
            }
        };

        fetchTechAreaList();
    }, [refresh]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            console.log(data);
            const token = localStorage.getItem('access');
            const response = await axios.post('http://192.168.137.161:8000/hr/domain-interest/', {
                qualification: data.techArea,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTechAreaList([...techAreaList, response.data]);
            toast.success("Added Successfully");
            reset();
            setRefresh(true);
        } catch (error) {
            toast.error('Failed to add tech area');
            console.error('Error adding tech area:', error);
            setError('Failed to add tech area');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id, index) => {
        try {
            const token = localStorage.getItem('access_token');
            await axios.delete(`http://192.168.137.161:8000/hr/qualification/${id}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const updatedList = [...techAreaList];
            updatedList.splice(index, 1);
            setTechAreaList(updatedList);

            toast.success('Tech area deleted successfully');
        } catch (error) {
            toast.error('Failed to delete tech area');
            console.error('Error deleting tech area:', error);
        }
    };

    console.log(techAreaList, "techAreaList");

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
                <div className="domain-header">
                    <div className="domain-title">
                        <span>Tech Area Management</span>
                    </div>
                </div>

                <div className="domain-form-layout">
                    <div className="domain-form-container">
                        <div className="domain-form">
                            <div className="domain-heading">
                                <span>Add Tech Areas</span>
                            </div>
                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <Label className="domain-label">Tech Area</Label>
                                <Input
                                    type="text"
                                    register={register('techArea', {
                                        required: { value: true, message: 'This field is required' },
                                    })}
                                    error={errors.techArea}
                                    placeholder={errors.techArea?.message || ''}
                                /> <br />
                                <Button type="submit" disabled={isSubmitting} id="submit-btn2">
                                    {isSubmitting ? 'Adding...' : 'Add'}
                                </Button>
                            </Form>
                        </div>
                    </div>

                    <div className="domain-list-container">
                        <div className="domain-list-label">
                            <span>Existing Tech Areas</span>
                        </div>
                        <div className="domain-list-items">
                            {techAreaList.length > 0 ? (
                                techAreaList.slice(0, 3).map((techArea, index) => (
                                    <div key={index} className="domain-item">
                                        <span>{techArea.qualification || 'Loading...'}</span><div id='border'></div>
                                        <div>
                                            <Button id="edit-btn"><img src={editIcon} alt="" /></Button>
                                            <Button id="submit-btn3" onClick={() => handleDelete(techArea.id, index)}>
                                                <img src={deleteIcon} alt="" />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div id="warning">No tech area found</div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="domain-stats">
                    <span>Tech Areas</span>
                    <div className="total-domains">
                        Total tech areas
                        <span>{techAreaList.length}</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TechArea;