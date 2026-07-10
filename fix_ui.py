import glob

# Files to update
files = glob.glob(r'd:\1 - Projects\robuzta\pages\*.html')

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Replace Mobile Menu Logo
    content = content.replace(
        '<a class="mobile-menu__header-logo" href="index.html"><img alt="Robuzta Techlabs" src="../images/robuzta_logo_scaled.png" class="h-6 w-auto brightness-0 invert"/></a>',
        '<a class="mobile-menu__header-logo" href="index.html"><img alt="Robuzta Techlabs" src="../images/robuzta_logo_scaled.png" class="w-28 h-auto brightness-0 invert"/></a>'
    )
    
    # Replace Site Nav Logo
    content = content.replace(
        '<img src="../images/robuzta_logo_scaled.png" alt="Robuzta Techlabs" class="h-8 md:h-10 w-auto transition-transform hover:scale-105">',
        '<img src="../images/robuzta_logo_scaled.png" alt="Robuzta Techlabs" class="w-32 md:w-44 h-auto transition-transform hover:scale-105">'
    )

    # Replace Quote Modal
    old_modal = """    <!-- Quote Modal -->
    <div id="quoteModal" class="hidden fixed inset-0 z-50 overflow-y-auto bg-primary-container/80 backdrop-blur-md flex items-center justify-center p-4">
        <div class="glass-card w-full max-w-lg rounded-3xl p-8 relative animate-fade-in-up">
            <button id="closeQuoteModal" class="absolute top-6 right-6 text-on-surface-variant hover:text-primary transition-colors">
                <span class="material-symbols-outlined text-2xl">close</span>
            </button>
            <h3 class="font-headline-md text-headline-md text-primary mb-2">Get a Repair Quote</h3>
            <p class="text-on-surface-variant mb-6 text-sm">Tell us about your device issue and our team will get back to you with a transparent estimate.</p>
            <form id="quoteForm" class="space-y-4">
                <div>
                    <label for="clientName" class="block text-sm font-medium text-primary mb-1">Your Name</label>
                    <input type="text" id="clientName" required class="w-full bg-white/5 border border-border-subtle rounded-xl px-4 py-3 focus:outline-none focus:border-secondary text-primary" placeholder="Enter your full name">
                </div>
                <div>
                    <label for="clientPhone" class="block text-sm font-medium text-primary mb-1">Phone Number</label>
                    <input type="tel" id="clientPhone" required class="w-full bg-white/5 border border-border-subtle rounded-xl px-4 py-3 focus:outline-none focus:border-secondary text-primary" placeholder="e.g. +91 99999 99999">
                </div>
                <div>
                    <label for="deviceDropdown" class="block text-sm font-medium text-primary mb-1">Select Device</label>
                    <select id="deviceDropdown" required class="w-full bg-white/5 border border-border-subtle rounded-xl px-4 py-3 focus:outline-none focus:border-secondary text-primary">
                        <option value="" disabled selected class="text-primary-container">Choose a device...</option>
                        <option value="Laptop" class="text-primary-container">Laptop</option>
                        <option value="MacBook" class="text-primary-container">MacBook</option>
                        <option value="Mobile" class="text-primary-container">Mobile</option>
                        <option value="Desktop" class="text-primary-container">Desktop</option>
                    </select>
                </div>
                <div>
                    <label for="issueDescription" class="block text-sm font-medium text-primary mb-1">Describe the Issue</label>
                    <textarea id="issueDescription" rows="3" required class="w-full bg-white/5 border border-border-subtle rounded-xl px-4 py-3 focus:outline-none focus:border-secondary text-primary" placeholder="Describe what's wrong with your device..."></textarea>
                </div>
                <button type="submit" class="w-full bg-secondary text-on-secondary py-4 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all shadow-lg mt-2">
                    Get Repair Quote
                </button>
            </form>
        </div>
    </div>"""

    new_modal = """    <!-- Quote Modal -->
    <div id="quoteModal" class="hidden fixed inset-0 z-50 overflow-y-auto bg-primary-container/80 backdrop-blur-md">
        <div class="flex min-h-full items-center justify-center p-4">
            <div class="glass-card w-full max-w-lg rounded-2xl md:rounded-3xl p-6 md:p-8 relative animate-fade-in-up my-8">
                <button id="closeQuoteModal" class="absolute top-4 right-4 md:top-6 md:right-6 text-on-surface-variant hover:text-primary transition-colors">
                    <span class="material-symbols-outlined text-2xl">close</span>
                </button>
                <h3 class="font-headline-md text-headline-md text-primary mb-2">Get a Repair Quote</h3>
                <p class="text-on-surface-variant mb-4 md:mb-6 text-sm">Tell us about your device issue and our team will get back to you with a transparent estimate.</p>
                <form id="quoteForm" class="space-y-4">
                    <div>
                        <label for="clientName" class="block text-sm font-medium text-primary mb-1">Your Name</label>
                        <input type="text" id="clientName" required class="w-full bg-white/5 border border-border-subtle rounded-xl px-4 py-3 focus:outline-none focus:border-secondary text-primary" placeholder="Enter your full name">
                    </div>
                    <div>
                        <label for="clientPhone" class="block text-sm font-medium text-primary mb-1">Phone Number</label>
                        <input type="tel" id="clientPhone" required class="w-full bg-white/5 border border-border-subtle rounded-xl px-4 py-3 focus:outline-none focus:border-secondary text-primary" placeholder="e.g. +91 99999 99999">
                    </div>
                    <div>
                        <label for="deviceDropdown" class="block text-sm font-medium text-primary mb-1">Select Device</label>
                        <select id="deviceDropdown" required class="w-full bg-white/5 border border-border-subtle rounded-xl px-4 py-3 focus:outline-none focus:border-secondary text-primary">
                            <option value="" disabled selected class="text-primary-container">Choose a device...</option>
                            <option value="Laptop" class="text-primary-container">Laptop</option>
                            <option value="MacBook" class="text-primary-container">MacBook</option>
                            <option value="Mobile" class="text-primary-container">Mobile</option>
                            <option value="Desktop" class="text-primary-container">Desktop</option>
                        </select>
                    </div>
                    <div>
                        <label for="issueDescription" class="block text-sm font-medium text-primary mb-1">Describe the Issue</label>
                        <textarea id="issueDescription" rows="3" required class="w-full bg-white/5 border border-border-subtle rounded-xl px-4 py-3 focus:outline-none focus:border-secondary text-primary" placeholder="Describe what's wrong with your device..."></textarea>
                    </div>
                    <button type="submit" class="w-full bg-secondary text-on-secondary py-4 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all shadow-lg mt-2">
                        Get Repair Quote
                    </button>
                </form>
            </div>
        </div>
    </div>"""

    content = content.replace(old_modal, new_modal)

    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)
    print(f"Updated {f}")
