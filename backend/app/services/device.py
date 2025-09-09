import hashlib
from typing import Dict
from fastapi import Request
from app.schemas.session import DeviceInfo

class DeviceService:
    
    @staticmethod
    def extract_device_info(request: Request) -> DeviceInfo:
        """Extract device information from request headers"""
        user_agent = request.headers.get("user-agent", "")
        accept_language = request.headers.get("accept-language", "")
        
        # Parse user agent for device type
        device_type = DeviceService._parse_device_type(user_agent)
        browser = DeviceService._parse_browser(user_agent)
        os = DeviceService._parse_os(user_agent)
        
        return DeviceInfo(
            user_agent=user_agent,
            device_type=device_type,
            browser=browser,
            operating_system=os,
            accept_language=accept_language,
            ip_address=DeviceService._get_client_ip(request)
        )
    
    @staticmethod
    def _get_client_ip(request: Request) -> str:
        """Extract client IP address considering proxies"""
        forwarded_for = request.headers.get("x-forwarded-for")
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()
        
        real_ip = request.headers.get("x-real-ip")
        if real_ip:
            return real_ip
        
        return request.client.host if request.client else "unknown"
    
    @staticmethod
    def _parse_device_type(user_agent: str) -> str:
        """Determine device type from user agent"""
        ua_lower = user_agent.lower()
        
        if any(mobile in ua_lower for mobile in ["mobile", "android", "iphone"]):
            return "mobile"
        elif any(tablet in ua_lower for tablet in ["tablet", "ipad"]):
            return "tablet"
        else:
            return "desktop"
    
    @staticmethod
    def _parse_browser(user_agent: str) -> str:
        """Extract browser information"""
        ua_lower = user_agent.lower()
        
        if "chrome" in ua_lower and "edg" not in ua_lower:
            return "Chrome"
        elif "firefox" in ua_lower:
            return "Firefox"
        elif "safari" in ua_lower and "chrome" not in ua_lower:
            return "Safari"
        elif "edg" in ua_lower:
            return "Edge"
        else:
            return "Unknown"
    
    @staticmethod
    def _parse_os(user_agent: str) -> str:
        """Extract operating system information"""
        ua_lower = user_agent.lower()
        
        if "windows" in ua_lower:
            return "Windows"
        elif "mac" in ua_lower and "iphone" not in ua_lower:
            return "macOS"
        elif "linux" in ua_lower:
            return "Linux"
        elif "android" in ua_lower:
            return "Android"
        elif "iphone" in ua_lower or "ios" in ua_lower:
            return "iOS"
        else:
            return "Unknown"
    
 
    @staticmethod
    def generate_device_fingerprint(device_info: DeviceInfo) -> str:
        """Generate unique fingerprint for each session"""
        import time
        # Make each session unique by adding timestamp
        fingerprint_data = f"{device_info.user_agent}|{time.time()}"
        return hashlib.md5(fingerprint_data.encode()).hexdigest()



device_service = DeviceService()