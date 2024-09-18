"use client";
import React from 'react';
import './CJobCard.css';
import { Button } from '@mui/material';
import moment from 'moment';
import Link from 'next/link';

interface CJobCardProps {
    jobDate: string,
    jobTitle: string,
    jobCompany: string,
    jobType: string,
    salary: string,
    jobLocation: string,
    companyLogo: string
    showDetails: () => void,
    job: any
    setJobDetailsModal: (jobData: any) => void,
}

const CJobCard = (props: CJobCardProps) => {
    const finalDate = moment(props.jobDate).format("DD MMM, YYYY")
    return (
        <div className='card'>
            <div className='job-content'>
                <div className='job-date'>
                    <text>{finalDate}</text>
                </div>

                <div className='company-desc'>
                    <div className='comp-div'>
                        <text className='company'>{props.jobCompany}</text>
                        <text className='title'>{props.jobTitle}</text>
                    </div>

                    <div className='company-logo'>
                        <img src={props.companyLogo} style={{ height: 'auto', alignItems: 'center', maxHeight: '100%' }} />
                    </div>
                </div>

                <div className='job-type'>
                    <text>{props.jobType}</text>
                </div>
            </div>

            <div className='footer'>
                <div className='salary-div'>
                    <text className='sal'>${props.salary}/ Annum</text>
                    <text className='location'>{props.jobLocation}</text>
                </div>

                <div>
                    {/* <Link href={{ pathname: '/home/job-details', query: { data: JSON.stringify(props.job) } }}> */}
                    <Button className='details-bttn' style={{
                        backgroundColor: 'rgba(140, 226, 112, 0.859)',
                        color: '#000',
                        borderRadius: '24px',
                        paddingLeft: '1.3rem',
                        paddingRight: '1.3rem',
                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.16)',
                    }} onClick={() => props.setJobDetailsModal(props.job)}>
                        Details
                    </Button>
                    {/* </Link> */}
                </div>
            </div>

        </div >
    )
}

export default CJobCard;