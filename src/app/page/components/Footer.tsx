import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-900 text-white p-6">
            <div className="container mx-auto flex flex-col items-center space-y-4">
                <div className="flex space-x-4">
                    <a href="https://www.facebook.com" aria-label="Facebook" className="hover:text-blue-600">
                        <FaFacebookF size={24} />
                    </a>
                    <a href="https://www.twitter.com" aria-label="Twitter" className="hover:text-blue-400">
                        <FaTwitter size={24} />
                    </a>
                    <a href="https://www.instagram.com" aria-label="Instagram" className="hover:text-pink-500">
                        <FaInstagram size={24} />
                    </a>
                    <a href="https://www.youtube.com" aria-label="YouTube" className="hover:text-red-600">
                        <FaYoutube size={24} />
                    </a>
                </div>
                <div className="text-sm text-center space-x-4">
                    <a href="/conditions" className="hover:underline">
                        Conditions of Use
                    </a>
                    <span>|</span>
                    <a href="/privacy-policy" className="hover:underline">
                        Privacy & Policy
                    </a>
                    <span>|</span>
                    <a href="/press-room" className="hover:underline">
                        Press Room
                    </a>
                </div>
                <div className="text-xs text-center">
                    © 2024 All Rights Reserved by MovieBuff
                </div>
            </div>
        </footer>
    );
};

export default Footer;
