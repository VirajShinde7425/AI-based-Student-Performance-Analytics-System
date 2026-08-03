import React, { useEffect, useState } from "react";
import api from "../services/api";

export const MyProfilePage = () => {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const response = await api.get("/my/profile");
                setProfile(response.data);
            } catch (err) {
                console.error(err);
            }
        };

        loadProfile();
    }, []);

    if (!profile) {
        return (
            <div className="text-center mt-10">
                Loading Profile...
            </div>
        );
    }

    return (
        <div className="space-y-6">

            <div className="saas-card p-6 flex items-center gap-6">

                <img
                    src={profile.avatarUrl}
                    alt={profile.fullName}
                    className="w-28 h-28 rounded-full"
                />

                <div>

                    <h1 className="text-3xl font-bold">
                        {profile.fullName}
                    </h1>

                    <p>{profile.email}</p>

                    <p>
                        {profile.departmentName}
                    </p>

                    <p>
                        Semester {profile.semester}
                    </p>

                    <p>
                        Division {profile.division}
                    </p>

                </div>

            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

                <div className="saas-card p-5">
                    <h3>Attendance</h3>
                    <p className="text-2xl font-bold">
                        {profile.attendancePercentage}%
                    </p>
                </div>

                <div className="saas-card p-5">
                    <h3>Average Marks</h3>
                    <p className="text-2xl font-bold">
                        {profile.averageMarks}
                    </p>
                </div>

                <div className="saas-card p-5">
                    <h3>Current GPA</h3>
                    <p className="text-2xl font-bold">
                        {profile.currentGpa}
                    </p>
                </div>

                <div className="saas-card p-5">
                    <h3>Predicted GPA</h3>
                    <p className="text-2xl font-bold">
                        {profile.predictedGpa}
                    </p>
                </div>

            </div>

            <div className="saas-card p-6">

                <h2 className="font-bold text-lg mb-2">
                    AI Recommendation
                </h2>

                <p>
                    {profile.aiRecommendation}
                </p>

            </div>

        </div>
    );
};