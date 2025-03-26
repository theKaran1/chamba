import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import Form from '../utils/Form';
import Label from '../utils/Label';
import previousIcon from '../../assets/img/previous.png';
import nextIcon from '../../assets/img/next.png';
import Input from '../utils/Input';
import deleteIcon from '../../assets/img/delete.png';
import editIcon from '../../assets/img/editing.png';
import { SideBar } from '../PageSections/SideBar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '../utils/Button';
import { BaseUrl } from '../utils/Endpoint';

const DomainInterest = () => {
  const [domainList, setDomainList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const [itemsPerPage, setItemsPerPage] = useState(5); // Items per page

  // Fetch domain list
  useEffect(() => {
    const fetchDomainList = async () => {
      try {
        const token = localStorage.getItem('access');
        const response = await axios.get(`${BaseUrl}/api/domain-interests/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDomainList(response?.data ? response?.data : []);
      } catch (error) {
        toast.error('Something went wrong, can\'t fetch list');
        console.error('Error fetching domain list:', error);
      }
    };

    fetchDomainList();
  }, [refresh]);

  // Form handling
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('access');
      const response = await axios.post(`${BaseUrl}/api/domain-interests/`, {
        domain_name: data.domain_name,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDomainList([...domainList, response.data]);
      toast.success('Added Successfully');
      reset();
      setRefresh(true);
    } catch (error) {
      toast.error('Failed to add domain interest');
      console.error('Error adding domain interest:', error);
      setError('Failed to add domain interest');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete functionality
  const handleDelete = async (id, index) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BaseUrl}/api/domain-interest/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedList = [...domainList];
      updatedList.splice(index, 1);
      setDomainList(updatedList);
      toast.success('Domain interest deleted successfully');
    } catch (error) {
      toast.error('Failed to delete domain interest');
      console.error('Error deleting domain interest:', error);
    }
  }; 

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage; 
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = domainList.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(domainList.length / itemsPerPage);

  // Updated pagination rendering logic
  const renderPageNumbers = () => {
    const pageButtons = [];

    // Show the current page
    pageButtons.push(
      <button
        key={currentPage}
        onClick={() => handlePageChange(currentPage)}
        className="active"
      >
        {currentPage}
      </button>
    );

    // Show the next page if it exists
    if (currentPage + 1 <= totalPages) {
      pageButtons.push(
        <button
          key={currentPage + 1}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          {currentPage + 1}
        </button>
      );
    }

    // Show the last page if it's not already shown (i.e., not current or next)
    if (totalPages > currentPage + 1) {
      pageButtons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    return pageButtons;
  };

  const handlePageChange = (pageNumber) => {
    // Ensure pageNumber stays within valid bounds
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
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
      <div className="domain-container">
        {/* Domain Header */}
        <div className="domain-header">
          <div className="domain-title">
            <span>Domain Management</span>
          </div>
        </div>

        {/* Form and List Container */}
        <div className="domain-form-layout">
          {/* Form Container */}
          <div className="domain-form-container">
            <div className="domain-form">
              <div className="domain-heading">
                <span>Add Domain</span>
              </div>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Label className="domain-label">Domain Name</Label>
                <Input
                  type="text"
                  register={register('domain_name', {
                    required: { value: true, message: 'This field is required' },
                  })}
                  error={errors.domain_name}
                  placeholder={errors.domain_name?.message || ''}
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
              <span>Existing Domain's</span>
            </div>
            <div className="pagination">
              <button
                id='pagination-btn'
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
               <img src={previousIcon} alt="" />
              </button>

              {renderPageNumbers()}

              <button
                id='pagination-btn'
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <img src={nextIcon} alt="" />
              </button>
            </div>
            <div className="domain-list-items">
              {currentItems.length > 0 ? (
                currentItems.map((domain, index) => (
                  <div key={index} className="domain-item">
                    <span>{domain.domain_name || 'Loading...'}</span>
                    <div id="border"></div>
                    <div>
                      <Button id="edit-btn">
                        <img src={editIcon} alt="" />
                      </Button>
                      <Button id="submit-btn3" onClick={() => handleDelete(domain.id, index)}>
                        <img src={deleteIcon} alt="" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div id="warning">No domains found</div>
              )}
            </div>
          </div>
        </div>
       
        <div className="domain-stats">
          <span>Total Domain's</span>
          <div className="total-domains">
            Total Number of Domain
            <span>{domainList.length}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default DomainInterest;