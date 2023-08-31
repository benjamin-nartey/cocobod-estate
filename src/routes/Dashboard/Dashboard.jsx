

const Card = () => {
  return (
    <div className="w-full sm:w-full md:w-1/3 lg:w-1/4 xl:w-1/4 mb-4 bg-white shadow-md rounded-[20px] h-[200px] cursor-pointer hover:shadow-xl transition-all "></div>
  );
};

const Dashboard = () => {

  return (
    <section className="w-full p-6">
      <div className="flex w-full flex-wrap gap-4">
        {[1, 2, 3].map((_, i) => (
          <Card key={i} />
        ))}
      </div>
    </section>
  );
};

export default Dashboard;
