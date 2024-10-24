import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
      <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt=""
            src="https://cdn.dribbble.com/users/69311/screenshots/9024876/media/4156e89d0a3e5ce88801596aca0bd15d.jpg?resize=1000x750&vertical=center"
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />
        </section>

        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
          <div className="relative -mt-16 block lg:hidden">
              <a
                className="inline-flex size-16 items-center justify-center rounded-full bg-white text-blue-600 sm:size-20"
                href="#"
              >
                <span className="sr-only">Home</span>
                <img
                  className="h-8 sm:h-10"
                  src="/advisrr.svg"
                  alt="Home"
                />
              </a>

              <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
                Welcome to SmartBudget AI 📈
              </h1>

              <p className="mt-4 leading-relaxed text-gray-500">
              The best AI-powered solution for budgeting and expense tracking on the web.
              </p> <br />
            </div>


            <div className='clerk-theme'>
              <SignUp
                appearance={{
                  elements: {
                    formButtonPrimary: 'clerk-button-primary',
                    footerActionLink: 'clerk-footer-action',
                    headerTitle: 'clerk-header-title',
                    headerSubtitle: 'clerk-header-subtitle',
                    card: 'clerk-card',
                    headerSubtitle: 'clerk-header-subtitle',
                    header: 'clerk-header',
                    main: 'clerk-main'
                  },
                  layout: {
                    logoPlacement: 'inside',
                    logoImageUrl: '/advisrr.svg',
                  },
                }}
              />
            </div>
          </div>
        </main>

      </div>
    </section>
  )
}