"use client";
import { GoogleMap, InfoWindow, Marker, useLoadScript } from '@react-google-maps/api';
import './jobRadius.css'
import React, { useEffect, useState } from 'react';
import CModal from '../../../../components/CModal/CModal';
import CustomAutoComplete from '../../../../components/CustomAutoComplete/CustomAutoComplete';
import { axiosInstance } from '../../../../api';
import { getJobsByRadius } from '../../../../api/routes';
import { Button, Result } from 'antd';
import { useRouter } from 'next/navigation';
import CJobCard from '../../../../components/CJobCard/CJobCard';
import { GOOGLE_MAPS_API_KEY } from '../../../../utils/CONSTANTS';
import { set } from 'date-fns';
import JobDetails from '../../../../components/JobDetails/JobDetails';


const randomPoints = Array.from({ length: 100 }, () => {
    return {
        latitude: 37.42216 + (Math.random() - 0.5) * 200 * 0.1,
        longitude: -122.08427 + (Math.random() - 0.5) * 1203 * 0.1,
        salary: Math.floor(Math.random() * 1000)
    }
})

const randomJobCards = Array.from({ length: 20 }, () => {
    return {
        jobDate: '20 May, 2023',
        jobTitle: 'Software Engineer',
        jobCompany: 'Google',
        jobType: 'Part Time',
        salary: '1000',
        jobLocation: 'San Francisco, CA',
        companyLogo: 'https://images.pexels.com/photos/17456631/pexels-photo-17456631/free-photo-of-mallorca.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    }
})

type pinCoordinates = {
    lat: number | undefined,
    lng: number | undefined
}


const JobRadiusPage = () => {
    const router = useRouter()
    const [markerPoints, setMarkerPoints] = useState([])
    const [dropPinToCoordinate, setDropPinToCoordinate] = useState<pinCoordinates>()
    const [center, setCenter] = useState<pinCoordinates>({ lat: 44.67793243770347, lng: -63.6071964288432 })
    const [markerJobs, setMarkerJobs] = useState([])
    const [viewJobModal, setViewJobModal] = useState(false)
    const [searchLocationData, setSearchLocationData] = useState<any>()
    const [jobDetailsModal, setJobDetailsModal] = useState(false)
    const [jobModalData, setJobModalData] = useState<any>(null)

    const map = useLoadScript({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        authReferrerPolicy: 'origin'
    })

    useEffect(() => {
        if (map.isLoaded && dropPinToCoordinate?.lat && dropPinToCoordinate?.lng) {
            axiosInstance.get(getJobsByRadius + dropPinToCoordinate?.lat + '/' + dropPinToCoordinate?.lng)
                .then(res => {
                    setMarkerPoints(res.data.jobs)
                    const response = res?.data?.jobs?.filter((value: any) => {
                        if (value?.employerEmail) {
                            return value
                        }
                    })
                    setMarkerJobs(response)
                })
                .catch(err => {
                    // console.log('error inside fetching jobs based on radius API ==>', err)
                })
        }
    }, [dropPinToCoordinate])

    const onMapClick = (e: google.maps.MapMouseEvent) => {
        e.domEvent.preventDefault()
        e.stop()
        setDropPinToCoordinate({ lat: e.latLng?.lat(), lng: e.latLng?.lng() })
    }

    const onSearchPress = () => {
        setViewJobModal(!viewJobModal)
        setDropPinToCoordinate({ lat: searchLocationData?.geometry?.location?.lat(), lng: searchLocationData?.geometry?.location?.lng() })
    }

    const jobDetailsModalStateHandler = (jobData: any) => {
        setJobModalData(jobData)
        setJobDetailsModal(!jobDetailsModal)
    }

    const onShowDetails = () => {

        router.push('/home/job-details')
    }

    return (
        <main className='root'>
            <title>Jobs By Radius</title>

            <div className='dividerView'>
                {map.isLoaded ? <div className='half-view'>
                    <GoogleMap
                        // @ts-ignore
                        center={center}
                        mapContainerStyle={{ width: '100%', height: '90%', cursor: 'pointer' }}
                        zoom={7}
                        clickableIcons={false}
                        options={{ fullscreenControl: false, streetViewControl: false, mapTypeControl: false }}
                        onClick={onMapClick}
                    >
                        {/* view to display the job pins based on the radius selected */}
                        {markerPoints?.map((point: any, index) => {
                            return (
                                <Marker
                                    key={index}
                                    position={{ lat: point.location.coordinates[1], lng: point.location.coordinates[0] }}
                                >
                                    <InfoWindow
                                        position={{ lat: point.location.coordinates[1], lng: point.location.coordinates[0] }}
                                        options={{
                                            pixelOffset: new google.maps.Size(0, -30)
                                        }}
                                    >
                                        <div>
                                            <h3>{point.jobTitle}</h3>
                                            <p>Salary: ${point.salary} / Month</p>
                                        </div>
                                    </InfoWindow>
                                </Marker>
                            )
                        })}

                        {/* view to drop pin on users selected location which will used to fetch the jobs based on that radius. */}
                        {dropPinToCoordinate?.lat && dropPinToCoordinate?.lng ? <Marker
                            position={{ lat: dropPinToCoordinate?.lat, lng: dropPinToCoordinate?.lng }}
                        /> : null}

                        {/* <div className='searchToolbar'>
                            <SearchSharpIcon onClick={() => setViewJobModal(!viewJobModal)} style={{ width: '2rem', height: '2rem', color: '#666' }} />
                        </div> */}
                    </GoogleMap>

                </div> : <div className='half-view'>Loading...</div>}

                <div className={markerJobs?.length > 0 ? "job-post2" : 'job-post'}>
                    {markerJobs?.length > 0 ? markerJobs?.map((card: any, index) => {

                        return (
                            <CJobCard
                                key={index}
                                jobTitle={card.jobTitle}
                                jobCompany={card.jobCompany}
                                jobType={card.jobType}
                                salary={card.salary}
                                jobLocation={card.jobLocation}
                                companyLogo={card.jobCompanyLogo}
                                jobDate={card.openDate}
                                showDetails={onShowDetails}
                                setJobDetailsModal={jobDetailsModalStateHandler}
                                job={card}
                            />
                        )
                    }) : <div className={"notFound-logo-jobs"}>
                        <Result
                            status="404"
                            title="No Jobs To Show.."
                            subTitle="Please drop a pin on map to view jobs in that location..."
                        />
                    </div>
                    }
                </div>
            </div>

            {viewJobModal ?
                <CModal
                    onClose={() => setViewJobModal(!viewJobModal)}
                    title='Search Jobs Based on Radius'
                >
                    <CustomAutoComplete onPlaceChanged={(selectedPlace) => setSearchLocationData(selectedPlace)} />
                    <Button type='primary' className='search-jobs' onClick={onSearchPress}>Search</Button>
                </CModal>
                : null}

            {
                jobModalData &&
                <JobDetails
                    jobDetailsOpen={jobDetailsModal}
                    handleClose={() => setJobDetailsModal(false)}
                    jobData={jobModalData}
                    isClickedByEmployer={false}
                />
            }


        </main>
    )
}



export default React.memo(JobRadiusPage);