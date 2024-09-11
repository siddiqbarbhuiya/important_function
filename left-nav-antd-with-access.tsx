import type { MenuProps } from 'antd';
import { Button, Menu } from 'antd';
import React, { useEffect, useState } from 'react';
// import 'antd/dist/antd.css';
import ialogoDashboard from 'assets/images_final/ialogo-dashboard.svg';
import ialogoDashboardCollapsed from 'assets/images_final/ialogo-dashboard-collapsed.svg';
import collapseIcon from 'assets/images_final/collapse-icon.svg';
import expandedIcon from 'assets/images_final/expanded-icon.svg';
import hiring from 'assets/images_final/hiring-icon.svg';
import hr from 'assets/images_final/hr-icon.svg';
import { parseUserDetails, useNavigate } from 'utils';

const menuItems = [
    {
        key: 'sub1',
        icon: <img src={hiring} />,
        label: 'Hiring',
        access: [2],
        children: [
            { key: '6', label: 'CV pool', to: '/hiring-cv-pool', access: [2] },
            { key: '7', label: 'Job Posting', to: '/hiring-job-posting', access: [2] },
            { key: '8', label: 'Review CV', to: '/hiring-review-cv', access: [2] },
        ],
    },
    {
        key: 'sub2',
        icon: <img src={hr} />,
        label: 'HR',
        access: [2, 3, 5],
        children: [
            { key: '9', label: 'Dashboard',  to: "/hiring-dashboard", access: [2] },
            { key: '10', label: 'Employee Skill Matrix', to: "/hiring-skillmatrix", access: [2] },
            { key: '11', label: 'Onboarding', to: '/onboarding', access: [2, 3, 5] },
            { key: '12', label: 'Offboarding', to: '/offboarding', access: [2, 3, 5]},
            { key: '13', label: 'Active Members' },
            {
                key: 'sub3',
                label: 'Report',
                children: [
                    { key: '14', label: 'Option 14' },
                    { key: '15', label: 'Option 15' },
                ],
            },
            {
                key: 'sub4',
                label: 'Leave Tracker',
                children: [
                    { key: '16', label: 'Option 16' },
                    { key: '17', label: 'Option 17' },
                ],
            },
            {
                key: 'sub5',
                label: 'Biometric',
                children: [
                    { key: '18', label: 'Option 18' },
                    { key: '19', label: 'Option 19' },
                ],
            },
        ],
    },
];

const filterMenuItems: any = (items: any[], roleId: number) => {
    return items
        .filter(item => !item.access || item.access.includes(roleId))
        .map(item => ({
            ...item,
            children: item.children ? filterMenuItems(item.children, roleId) : undefined,
        }));
};

const getKeyFromPathname = (pathname: string, items: any[]): string => {
    for (const item of items) {
        if (item.to === pathname) return item.key;
        if (item.children) {
            const childKey = getKeyFromPathname(pathname, item.children);
            if (childKey) return childKey;
        }
    }
    return '';
};

const LeftNavigation: React.FC = () => {
    const [collapsed, setCollapsed] = useState(() => {
        const savedState = localStorage.getItem("insite_avenues_left_nav");
        return savedState === null ? true : savedState === "true";
    });
    const [openKeys, setOpenKeys] = useState<string[]>(["sub1"]);
    const { navigate } = useNavigate();
    const roleId = parseUserDetails()?.role_id || 2;
    const pathname = window.location.pathname;

    const toggleCollapsed = () => {
        const newCollapsedState = !collapsed;
        localStorage.setItem("insite_avenues_left_nav", newCollapsedState.toString());
        setCollapsed(newCollapsedState);
    };

    const filteredItems = filterMenuItems(menuItems, roleId);

    const selectedKey = getKeyFromPathname(pathname, filteredItems);
    const openKey = selectedKey ? filteredItems.find(item => item.children?.some(child => child.key === selectedKey))?.key : 'sub1';
    const openKeysArray = openKey ? [openKey] : [];

    const onMenuClick: MenuProps['onClick'] = ({ key }) => {
        const item = filteredItems.flatMap(item => [item, ...(item.children || [])]).find(item => item.key === key);
        if (item?.to) {
            navigate(item.to);
        }
    };

    const onOpenChange = (keys: string[]) => {
        setOpenKeys(keys);
    };

    useEffect(() => {
        localStorage.setItem("insite_avenues_left_nav", collapsed.toString());
    }, [collapsed]);

    return (
        <div className='ia-leftNavWrap'>
            <div className={`ia-leftNavHeader ${collapsed ? 'ia-menu-collapsed' : ''}`}>
                {!collapsed ? <img src={ialogoDashboardCollapsed} /> : <img src={ialogoDashboard} />}
                <Button onClick={toggleCollapsed}>
                    {!collapsed ? <img src={expandedIcon} /> : <img src={collapseIcon} />}
                </Button>
            </div>
            <Menu
                selectedKeys={[selectedKey]}
                openKeys={collapsed ? openKeys: [""]}
                mode="inline"
                inlineCollapsed={!collapsed}
                onClick={onMenuClick}
                onOpenChange={onOpenChange}
                items={filteredItems.map(item => ({
                    ...item,
                    onClick: () => onMenuClick(item.key),
                    children: item.children ? item.children.map(child => ({
                        ...child,
                        onClick: () => onMenuClick(child.key),
                    })) : undefined,
                }))}
            />
        </div>
    );
};

export default LeftNavigation;


/*


import type { MenuProps } from 'antd';
import { Button, Menu } from 'antd';
import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import ialogoDashboard from 'assets/images_final/ialogo-dashboard.svg';
import ialogoDashboardCollapsed from 'assets/images_final/ialogo-dashboard-collapsed.svg';
import collapseIcon from 'assets/images_final/collapse-icon.svg';
import expandedIcon from 'assets/images_final/expanded-icon.svg';
import hiring from 'assets/images_final/hiring-icon.svg';
import hr from 'assets/images_final/hr-icon.svg';
import { useNavigate } from 'utils';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
    onClick?: () => void,
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        type,
        onClick
    } as MenuItem;
}
const LeftNavigation: React.FC = () => {
    const [collapsed, setCollapsed] = useState(() => {
        const savedState = localStorage.getItem("insite_avenues_left_nav");
        return savedState === null ? true : savedState === "true";
    });
    const { navigate } = useNavigate();

    const toggleCollapsed = () => {
        const newCollapsedState = !collapsed;
        localStorage.setItem("insite_avenues_left_nav", newCollapsedState.toString());
        setCollapsed(newCollapsedState);
    };

    const items: MenuItem[] = [
        getItem('Hiring', 'sub1', <img src={hiring} />, [
            // getItem('Dashboard', '5', undefined, undefined, undefined, () => navigate('/hiring-dashboard')),
            getItem('CV pool', '6', undefined, undefined, undefined, () => navigate('/hiring-cv-pool')),
            getItem('Job Posting', '7', undefined, undefined, undefined, () => navigate('/hiring-job-posting')),
            getItem('Review CV', '8', undefined, undefined, undefined, () => navigate('/hiring-review-cv')),
        ]),
        getItem('HR', 'sub2', <img src={hr} />, [
            getItem('Dashboard', '9'),
            getItem('Employee Skill Matrix', '10', undefined, undefined, undefined, () => navigate('/hiring-skillmatrix')),
            getItem('Onboarding', '11'),
            getItem('Offboarding', '12'),
            getItem('Active Members', '13'),
            getItem('Report', 'sub3', null, [
                getItem('Option 14', '14'),
                getItem('Option 15', '15'),
            ]),
            getItem('Leave Tracker', 'sub4', null, [
                getItem('Option 16', '16'),
                getItem('Option 17', '17'),
            ]),
            getItem('Biometric', 'sub5', null, [
                getItem('Option 18', '18'),
                getItem('Option 19', '19'),
            ]),
        ]),
    ];
    
    useEffect(() => {
        localStorage.setItem("insite_avenues_left_nav", collapsed.toString());
    }, [collapsed]);

    return (
        <div className='ia-leftNavWrap'>
            <div className={`ia-leftNavHeader ${!collapsed ? 'ia-menu-collapsed' : ''}`}>
                {!collapsed ? <img src={ialogoDashboardCollapsed} /> : <img src={ialogoDashboard}/>}
                <Button onClick={toggleCollapsed}>
                    {!collapsed ? <img src={expandedIcon} /> : <img src={collapseIcon} />}
                </Button>
            </div>
            <Menu
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                mode="inline"
                inlineCollapsed={!collapsed}
                items={items}
            />
        </div>  
    )
}

export default LeftNavigation;
