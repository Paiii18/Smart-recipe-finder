// File: src/i18n/config.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      nav: {
        home: 'Home',
        favorites: 'Favorites',
        mealPlanner: 'Meal Planner',
        profile: 'Profile',
        logout: 'Logout'
      },
      
      // Auth
      auth: {
        login: 'Login',
        register: 'Register',
        signUp: 'Sign Up',
        username: 'Username',
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        usernameOrEmail: 'Username or Email',
        loginButton: 'Sign In',
        registerButton: 'Create Account',
        noAccount: "Don't have an account?",
        haveAccount: 'Already have an account?',
        loginSuccess: 'Login successful!',
        registerSuccess: 'Registration successful!',
        loginFailed: 'Login failed',
        registerFailed: 'Registration failed'
      },
      
      // Home / Search
      home: {
        title: 'Smart Recipe Finder',
        heroTitle: 'Find Your Perfect Recipe',
        subtitle: 'Discover delicious recipes from around the world',
        searchPlaceholder: 'Search for recipes (e.g., chicken, pasta, salad...)',
        searchButton: 'Search',
        categories: 'Categories',
        allCategories: 'All Categories',
        clearFilters: 'Clear Filters',
        recipes: 'Recipes',
        searchResultsFor: 'Search Results for',
        featuredRecipes: 'Featured Recipes',
        noResults: 'No recipes found. Try a different search term.',
        tryDifferent: 'Try a different search term',
        loading: 'Loading delicious recipes...',
        noRecipes: 'No recipes to display',
        loadError: 'Failed to load recipes',
        searchFailed: 'Search failed. Please try again.',
        categoryLoadFailed: 'Failed to load category recipes'
      },
      
      // Recipe Detail
      recipe: {
        ingredients: 'Ingredients',
        instructions: 'Instructions',
        watchVideo: 'Watch Video Tutorial',
        addToFavorites: 'Add to Favorites',
        removeFromFavorites: 'Remove from Favorites',
        favoriteAdded: 'Added to favorites!',
        favoriteRemoved: 'Removed from favorites',
        category: 'Category',
        area: 'Cuisine',
        tags: 'Tags'
      },
      
      // Favorites
      favorites: {
        title: 'My Favorites',
        subtitle: 'Your saved recipes',
        noFavorites: 'No favorites yet',
        startAdding: 'Start adding recipes to your favorites!',
        browseRecipes: 'Browse Recipes',
        totalRecipes: 'Total Recipes'
      },
      
      // Meal Planner
      mealPlanner: {
        title: 'Meal Planner',
        subtitle: 'Plan your meals for the week',
        breakfast: 'Breakfast',
        lunch: 'Lunch',
        dinner: 'Dinner',
        today: 'Today',
        noMealPlanned: 'No meal planned',
        addMeal: 'Add Meal',
        removeMeal: 'Remove this meal from your plan?',
        mealAdded: 'Meal added successfully!',
        mealRemoved: 'Meal removed successfully',
        selectRecipe: 'Select a recipe',
        searchRecipes: 'Search recipes...',
        previousWeek: 'Previous week',
        nextWeek: 'Next week',
        mealType: 'Meal Type'
      },
      
      // Profile
      profile: {
        title: 'Profile',
        editProfile: 'Edit Profile',
        changePassword: 'Change Password',
        saveChanges: 'Save Changes',
        cancel: 'Cancel',
        currentPassword: 'Current Password',
        newPassword: 'New Password',
        confirmNewPassword: 'Confirm New Password',
        profileUpdated: 'Profile updated successfully!',
        passwordChanged: 'Password changed successfully!',
        memberSince: 'Member since',
        statistics: 'Statistics',
        favoritesCount: 'Favorite Recipes',
        mealPlansCount: 'Meal Plans',
        upcomingMeals: 'Upcoming Meals',
        dangerZone: 'Danger Zone',
        deleteAccount: 'Delete Account',
        deleteWarning: 'Once you delete your account, there is no going back. This will permanently delete your profile, favorites, and meal plans.',
        confirmDelete: 'Confirm Delete',
        enterPassword: 'Enter your password to confirm deletion',
        accountDeleted: 'Account deleted successfully',
        keepSecure: 'Keep your account secure by using a strong password.'
      },
      
      // Common
      common: {
        search: 'Search',
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        add: 'Add',
        remove: 'Remove',
        close: 'Close',
        confirm: 'Confirm',
        back: 'Back',
        next: 'Next',
        previous: 'Previous',
        viewAll: 'View All',
        noData: 'No data available',
        tryAgain: 'Try Again',
        language: 'Language'
      },
      
      // Days
      days: {
        monday: 'Monday',
        tuesday: 'Tuesday',
        wednesday: 'Wednesday',
        thursday: 'Thursday',
        friday: 'Friday',
        saturday: 'Saturday',
        sunday: 'Sunday',
        mon: 'Mon',
        tue: 'Tue',
        wed: 'Wed',
        thu: 'Thu',
        fri: 'Fri',
        sat: 'Sat',
        sun: 'Sun'
      }
    }
  },
  
  id: {
    translation: {
      // Navigasi
      nav: {
        home: 'Beranda',
        favorites: 'Favorit',
        mealPlanner: 'Rencana Makan',
        profile: 'Profil',
        logout: 'Keluar'
      },
      
      // Autentikasi
      auth: {
        login: 'Masuk',
        register: 'Daftar',
        signUp: 'Daftar',
        username: 'Nama Pengguna',
        email: 'Email',
        password: 'Kata Sandi',
        confirmPassword: 'Konfirmasi Kata Sandi',
        usernameOrEmail: 'Nama Pengguna atau Email',
        loginButton: 'Masuk',
        registerButton: 'Buat Akun',
        noAccount: 'Belum punya akun?',
        haveAccount: 'Sudah punya akun?',
        loginSuccess: 'Login berhasil!',
        registerSuccess: 'Pendaftaran berhasil!',
        loginFailed: 'Login gagal',
        registerFailed: 'Pendaftaran gagal'
      },
      
      // Beranda / Pencarian
      home: {
        title: 'Smart Recipe Finder',
        subtitle: 'Temukan resep lezat dari seluruh dunia',
        searchPlaceholder: 'Cari resep...',
        searchButton: 'Cari',
        allCategories: 'Semua Kategori',
        noResults: 'Resep tidak ditemukan',
        tryDifferent: 'Coba kata kunci pencarian lain',
        loading: 'Memuat resep...'
      },
      
      // Detail Resep
      recipe: {
        ingredients: 'Bahan-bahan',
        instructions: 'Cara Membuat',
        watchVideo: 'Tonton Video Tutorial',
        addToFavorites: 'Tambah ke Favorit',
        removeFromFavorites: 'Hapus dari Favorit',
        favoriteAdded: 'Ditambahkan ke favorit!',
        favoriteRemoved: 'Dihapus dari favorit',
        category: 'Kategori',
        area: 'Asal Masakan',
        tags: 'Tag'
      },
      
      // Favorit
      favorites: {
        title: 'Favorit Saya',
        subtitle: 'Resep tersimpan Anda',
        noFavorites: 'Belum ada favorit',
        startAdding: 'Mulai tambahkan resep ke favorit Anda!',
        browseRecipes: 'Jelajahi Resep',
        totalRecipes: 'Total Resep'
      },
      
      // Rencana Makan
      mealPlanner: {
        title: 'Rencana Makan',
        subtitle: 'Rencanakan makanan Anda untuk minggu ini',
        breakfast: 'Sarapan',
        lunch: 'Makan Siang',
        dinner: 'Makan Malam',
        today: 'Hari Ini',
        noMealPlanned: 'Belum ada rencana makan',
        addMeal: 'Tambah Makanan',
        removeMeal: 'Hapus makanan ini dari rencana?',
        mealAdded: 'Makanan berhasil ditambahkan!',
        mealRemoved: 'Makanan berhasil dihapus',
        selectRecipe: 'Pilih resep',
        searchRecipes: 'Cari resep...',
        previousWeek: 'Minggu sebelumnya',
        nextWeek: 'Minggu selanjutnya',
        mealType: 'Jenis Makan'
      },
      
      // Profil
      profile: {
        title: 'Profil',
        editProfile: 'Edit Profil',
        changePassword: 'Ubah Kata Sandi',
        saveChanges: 'Simpan Perubahan',
        cancel: 'Batal',
        currentPassword: 'Kata Sandi Saat Ini',
        newPassword: 'Kata Sandi Baru',
        confirmNewPassword: 'Konfirmasi Kata Sandi Baru',
        profileUpdated: 'Profil berhasil diperbarui!',
        passwordChanged: 'Kata sandi berhasil diubah!',
        memberSince: 'Bergabung sejak',
        statistics: 'Statistik',
        favoritesCount: 'Resep Favorit',
        mealPlansCount: 'Rencana Makan',
        upcomingMeals: 'Makanan Mendatang',
        dangerZone: 'Zona Berbahaya',
        deleteAccount: 'Hapus Akun',
        deleteWarning: 'Setelah Anda menghapus akun, tidak ada cara untuk mengembalikannya. Ini akan menghapus profil, favorit, dan rencana makan Anda secara permanen.',
        confirmDelete: 'Konfirmasi Hapus',
        enterPassword: 'Masukkan kata sandi Anda untuk konfirmasi penghapusan',
        accountDeleted: 'Akun berhasil dihapus',
        keepSecure: 'Jaga keamanan akun Anda dengan menggunakan kata sandi yang kuat.'
      },
      
      // Umum
      common: {
        search: 'Cari',
        loading: 'Memuat...',
        error: 'Kesalahan',
        success: 'Berhasil',
        save: 'Simpan',
        cancel: 'Batal',
        delete: 'Hapus',
        edit: 'Edit',
        add: 'Tambah',
        remove: 'Hapus',
        close: 'Tutup',
        confirm: 'Konfirmasi',
        back: 'Kembali',
        next: 'Selanjutnya',
        previous: 'Sebelumnya',
        viewAll: 'Lihat Semua',
        noData: 'Tidak ada data',
        tryAgain: 'Coba Lagi',
        language: 'Bahasa'
      },
      
      // Hari
      days: {
        monday: 'Senin',
        tuesday: 'Selasa',
        wednesday: 'Rabu',
        thursday: 'Kamis',
        friday: 'Jumat',
        saturday: 'Sabtu',
        sunday: 'Minggu',
        mon: 'Sen',
        tue: 'Sel',
        wed: 'Rab',
        thu: 'Kam',
        fri: 'Jum',
        sat: 'Sab',
        sun: 'Min'
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    lng: localStorage.getItem('language') || 'en', // Load from localStorage
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;