src="/Users/schinmayanilayam/personal/coursera/cs498_ddv/finalproject/cs498ddvsummer2018sc/data"
dest="/Users/schinmayanilayam/personal/coursera/cs498_ddv/finalproject/cs498ddvsummer2018sc/dataviz_final_project/data"

years="2015"
files="_PopulationByState.csv _KeyStatsByState.csv _TotalPopulationByRegion.csv _RacialDistributionPerRegion.csv"
for year in ${years}; do
  for file in ${files}; do
  travFile="acs${year}${file}"
  echo "<<<<< Copying ${travFile} >>>>>"
  cp ${src}/${travFile} ${dest}/${travFile} 
  done
done

