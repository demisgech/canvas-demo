import { Flag } from './Flag';

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

function init() {
    try {
        const flag = new Flag('flag');
        flag.draw();
        console.log('🇪🇹 Ethiopian flag drawn successfully!');
    } catch (error) {
        console.error('Error drawing flag:', error);
    }
}
