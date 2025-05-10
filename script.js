document.addEventListener('DOMContentLoaded', function () {
    // Navbar functionality for index.html
    const navLinks = document.querySelectorAll('.nav-link');
    if (navLinks.length > 0) {
        navLinks.forEach(link => {
            link.addEventListener('click', function () {
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }


    // Menu functionality for menu.html
    const galleryContainer = document.getElementById('foodGallery');
    if (galleryContainer) {
        async function loadMenu() {
            try {
                // Add a small delay to show loading animation
                await new Promise(resolve => setTimeout(resolve, 800));

                // Fetch the menu data from the JSON file
                const response = await fetch('menuData.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                const menuItems = data.menuItems;

                // Clear any existing content
                galleryContainer.innerHTML = '';

                // Populate the gallery with food items
                menuItems.forEach(item => {
                    const foodItemElement = createFoodItemElement(item);
                    galleryContainer.appendChild(foodItemElement);

                    // Add staggered fade-in animation
                    setTimeout(() => {
                        foodItemElement.style.opacity = '1';
                        foodItemElement.style.transform = 'translateY(0)';
                    }, 100 * (menuItems.indexOf(item) + 1));
                });

                // Add filter functionality
                addFilterFunctionality(menuItems, galleryContainer);

            } catch (error) {
                console.error('Error loading food data:', error);
                galleryContainer.innerHTML = '<div class="error-message"><i class="fas fa-exclamation-circle"></i> Error loading menu data. Please try again later.</div>';
            }
        }

        // Function to create a food item element
        function createFoodItemElement(item) {
            // Create elements
            const foodItem = document.createElement('div');
            const foodImage = document.createElement('img');
            const overlay = document.createElement('div');
            const foodInfo = document.createElement('div');
            const foodName = document.createElement('p');
            const foodPrice = document.createElement('p');
            const learnMoreBtn = document.createElement('button');

            // Set classes and attributes
            foodItem.className = 'food-item';
            foodItem.dataset.id = item.id;
            foodItem.dataset.category = item.category || 'all';
            foodItem.style.opacity = '0';
            foodItem.style.transform = 'translateY(20px)';
            foodItem.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

            foodImage.className = 'food-image';
            foodImage.src = item.image;
            foodImage.alt = item.name;
            foodImage.loading = 'lazy';

            overlay.className = 'overlay';
            foodInfo.className = 'food-info';
            foodName.className = 'food-name';
            foodPrice.className = 'food-price';
            learnMoreBtn.className = 'learn-more-btn';

            // Set content
            foodName.textContent = item.name;
            foodPrice.textContent = `$${item.price.toFixed(2)}`;
            learnMoreBtn.textContent = 'Details';

            // Add click event to the learn more button
            learnMoreBtn.addEventListener('click', function (e) {
                e.preventDefault();
                showFoodDetails(item);
            });

            // Append elements
            foodInfo.appendChild(foodName);
            foodInfo.appendChild(foodPrice);
            foodInfo.appendChild(learnMoreBtn);
            foodItem.appendChild(foodImage);
            foodItem.appendChild(overlay);
            foodItem.appendChild(foodInfo);

            return foodItem;
        }

        // Function to show food details in a modal
        function showFoodDetails(item) {
            // Create modal elements
            const modalOverlay = document.createElement('div');
            modalOverlay.className = 'modal-overlay';
            modalOverlay.style.position = 'fixed';
            modalOverlay.style.top = '0';
            modalOverlay.style.left = '0';
            modalOverlay.style.width = '100%';
            modalOverlay.style.height = '100%';
            modalOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            modalOverlay.style.display = 'flex';
            modalOverlay.style.justifyContent = 'center';
            modalOverlay.style.alignItems = 'center';
            modalOverlay.style.zIndex = '1000';
            modalOverlay.style.opacity = '0';
            modalOverlay.style.transition = 'opacity 0.3s ease';

            const modalContent = document.createElement('div');
            modalContent.className = 'modal-content';
            modalContent.style.backgroundColor = 'rgba(15, 14, 23, 0.9)';
            modalContent.style.backdropFilter = 'blur(15px)';
            modalContent.style.webkitBackdropFilter = 'blur(15px)';
            modalContent.style.borderRadius = '20px';
            modalContent.style.padding = '2rem';
            modalContent.style.maxWidth = '500px';
            modalContent.style.width = '90%';
            modalContent.style.position = 'relative';
            modalContent.style.border = '1px solid rgba(255, 255, 255, 0.2)';
            modalContent.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.5)';
            modalContent.style.transform = 'scale(0.9)';
            modalContent.style.transition = 'transform 0.3s ease';

            // Close button
            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '×';
            closeBtn.style.position = 'absolute';
            closeBtn.style.right = '15px';
            closeBtn.style.top = '15px';
            closeBtn.style.backgroundColor = 'transparent';
            closeBtn.style.border = 'none';
            closeBtn.style.color = 'white';
            closeBtn.style.fontSize = '24px';
            closeBtn.style.cursor = 'pointer';

            // Modal content
            const modalImage = document.createElement('img');
            modalImage.src = item.image;
            modalImage.alt = item.name;
            modalImage.style.width = '100%';
            modalImage.style.height = '200px';
            modalImage.style.objectFit = 'cover';
            modalImage.style.borderRadius = '10px';
            modalImage.style.marginBottom = '1rem';

            const modalTitle = document.createElement('h3');
            modalTitle.textContent = item.name;
            modalTitle.style.color = 'white';
            modalTitle.style.fontSize = '1.5rem';
            modalTitle.style.marginBottom = '0.5rem';

            const modalPrice = document.createElement('p');
            modalPrice.textContent = `$${item.price.toFixed(2)}`;
            modalPrice.style.color = '#ff4500';
            modalPrice.style.fontSize = '1.2rem';
            modalPrice.style.fontWeight = 'bold';
            modalPrice.style.marginBottom = '0.5rem';

            const modalDescription = document.createElement('p');
            modalDescription.textContent = item.description;
            modalDescription.style.color = 'white';
            modalDescription.style.lineHeight = '1.6';

            // Add order button
            const orderBtn = document.createElement('button');
            orderBtn.textContent = 'Add to Order';
            orderBtn.style.backgroundColor = '#ff4500';
            orderBtn.style.color = 'white';
            orderBtn.style.border = 'none';
            orderBtn.style.padding = '0.8rem 1.5rem';
            orderBtn.style.borderRadius = '50px';
            orderBtn.style.marginTop = '1.5rem';
            orderBtn.style.cursor = 'pointer';
            orderBtn.style.fontWeight = '500';
            orderBtn.style.transition = 'all 0.3s ease';

            orderBtn.addEventListener('mouseover', function () {
                this.style.backgroundColor = '#e63900';
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 6px 20px rgba(255, 69, 0, 0.6)';
            });

            orderBtn.addEventListener('mouseout', function () {
                this.style.backgroundColor = '#ff4500';
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
            });

            orderBtn.addEventListener('click', function () {
                alert(`Added ${item.name} to your order!`);
            });

            // Append elements to modal
            modalContent.appendChild(closeBtn);
            modalContent.appendChild(modalImage);
            modalContent.appendChild(modalTitle);
            modalContent.appendChild(modalPrice);
            modalContent.appendChild(modalDescription);
            modalContent.appendChild(orderBtn);
            modalOverlay.appendChild(modalContent);

            // Add modal to body
            document.body.appendChild(modalOverlay);

            // Trigger animation
            setTimeout(() => {
                modalOverlay.style.opacity = '1';
                modalContent.style.transform = 'scale(1)';
            }, 10);

            // Close modal on button click
            closeBtn.addEventListener('click', function () {
                modalOverlay.style.opacity = '0';
                modalContent.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    document.body.removeChild(modalOverlay);
                }, 300);
            });

            // Close modal on overlay click
            modalOverlay.addEventListener('click', function (e) {
                if (e.target === modalOverlay) {
                    modalOverlay.style.opacity = '0';
                    modalContent.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        document.body.removeChild(modalOverlay);
                    }, 300);
                }
            });
        }

        // Function to add filter functionality
        function addFilterFunctionality(menuItems, container) {
            console.log('Filter functionality can be added here');
        }

        // Execute menu loading
        loadMenu();
    }
});